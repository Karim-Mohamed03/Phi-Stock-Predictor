import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout
import tensorflow as tf

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/predict', methods=['POST'])
def predict_stock():
    print("Received request at /predict")
    try:
        data = request.get_json()
        if not data or 'symbol' not in data:
            return jsonify({'error': 'Missing stock symbol'}), 400
        
        stock_symbol = data['symbol']
        timeframe = data.get('timeframe', '6m')
        future_days = 30  # Number of days to predict into the future
        
        # Calculate dates
        end = datetime.now()
        timeframe_days = {
            '6m': 180,
            '3m': 90,
            '1m': 30,
            '1w': 7
        }
        display_days = timeframe_days.get(timeframe, 180)
        display_start = end - timedelta(days=display_days)
        training_start = datetime(2012, 1, 1)
        
        # Download data
        df = yf.download(stock_symbol, start=training_start, end=end)
        if df.empty:
            return jsonify({'error': 'Invalid stock symbol'}), 400

        # Preprocessing
        closing_prices = df['Close'].values.reshape(-1, 1)
        scaler = MinMaxScaler(feature_range=(0,1))
        scaled_data = scaler.fit_transform(closing_prices)
        
        # Prepare training data
        training_data_length = int(np.ceil(len(closing_prices) * 0.98))
        train_data = scaled_data[0:training_data_length, :]
        x_train = []
        y_train = []
        
        for i in range(60, len(train_data)):
            x_train.append(train_data[i-60:i, :])
            y_train.append(train_data[i, 0])
            
        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
        
        # Build and train model
        model = Sequential([
            LSTM(256, return_sequences=True, input_shape=(x_train.shape[1], 1)),
            Dropout(0.2),
            LSTM(128, return_sequences=True),
            Dropout(0.2),
            LSTM(64),
            Dense(1)
        ])
        
        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                     loss='mean_squared_error')
        
        model.fit(x_train, y_train, batch_size=64, epochs=20, validation_split=0.1)
        
        # Prepare test data for historical predictions
        test_data = scaled_data[training_data_length - 60:, :]
        x_test = []
        y_test = closing_prices[training_data_length:, :]
        
        for i in range(60, len(test_data)):
            x_test.append(test_data[i-60:i, :])
            
        x_test = np.array(x_test)
        x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
        
        # Make historical predictions
        predictions = model.predict(x_test)
        predictions = scaler.inverse_transform(predictions)
        
        # Predict future values
        future_predictions = []
        last_60_days = scaled_data[-60:]  # Get the last 60 days of data
        
        current_batch = last_60_days.reshape((1, 60, 1))  # Reshape for prediction
        
        for i in range(future_days):
            # Get the prediction for the next day
            current_pred = model.predict(current_batch)[0]
            # Add the prediction to our results
            future_predictions.append(current_pred[0])
            # Update the batch to include the new prediction
            current_batch = np.roll(current_batch, -1, axis=1)
            current_batch[0, -1, 0] = current_pred[0]
        
        # Scale back the future predictions
        future_predictions = np.array(future_predictions).reshape(-1, 1)
        future_predictions = scaler.inverse_transform(future_predictions)
        
        # Generate future dates
        future_dates = [(end + timedelta(days=x+1)).strftime('%Y-%m-%d') 
                       for x in range(future_days)]
        
        # Filter historical data based on selected timeframe
        display_mask = df.index >= display_start
        display_df = df[display_mask]
        
        # Prepare response data
        historical_data = display_df['Close'].values.tolist()
        dates = display_df.index.strftime('%Y-%m-%d').tolist()
        
        # Filter prediction data to match the timeframe
        prediction_dates = [d for d in df.index.strftime('%Y-%m-%d').tolist()[training_data_length:] 
                          if datetime.strptime(d, '%Y-%m-%d') >= display_start]
        actual_values = [v for i, v in enumerate(df['Close'].values[training_data_length:].tolist())
                        if df.index[training_data_length + i] >= display_start]
        predicted_values = [v for i, v in enumerate(predictions.flatten().tolist())
                          if df.index[training_data_length + i] >= display_start]
        
        return jsonify({
            'dates': dates,
            'historical': historical_data,
            'predictionDates': prediction_dates + future_dates,
            'actualValues': actual_values + [None] * future_days,  # Pad with None for future dates
            'predictedValues': predicted_values + future_predictions.flatten().tolist()
        })
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


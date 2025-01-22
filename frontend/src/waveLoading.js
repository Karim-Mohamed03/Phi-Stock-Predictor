import React from 'react';

const WaveLoading = () => {
  return (
    <div className="relative w-full h-64 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <svg 
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path 
            className="animate-wave fill-purple-600/50"
            fillOpacity="1" 
            d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,154.7C672,160,768,128,864,112C960,96,1056,96,1152,106.7C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
          </path>
          <path 
            className="animate-wave-slow fill-purple-500/50"
            fillOpacity="1" 
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,192C672,192,768,160,864,154.7C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
          </path>
          <path 
            className="animate-wave-slower fill-purple-400/50"
            fillOpacity="1" 
            d="M0,256L48,261.3C96,267,192,277,288,277.3C384,277,480,267,576,240C672,213,768,171,864,165.3C960,160,1056,192,1152,208C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
          </path>
        </svg>
      </div>
      <div className="relative z-10">
        <span className="text-3xl font-bold text-white animate-pulse">Loading...</span>
      </div>
    </div>
  );
};

export default WaveLoading;
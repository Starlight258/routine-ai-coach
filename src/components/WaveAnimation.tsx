
import React from 'react';

const WaveAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wave layers */}
      <div className="absolute bottom-0 left-0 w-full h-64 opacity-20">
        <svg 
          className="absolute bottom-0 w-full h-full" 
          viewBox="0 0 1200 320" 
          preserveAspectRatio="none"
        >
          <path
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#wave1)"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Second wave */}
      <div className="absolute bottom-0 left-0 w-full h-48 opacity-15">
        <svg 
          className="absolute bottom-0 w-full h-full" 
          viewBox="0 0 1200 320" 
          preserveAspectRatio="none"
        >
          <path
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,181.3C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#wave2)"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating islands */}
      <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute top-40 left-10 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-15 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
    </div>
  );
};

export default WaveAnimation;

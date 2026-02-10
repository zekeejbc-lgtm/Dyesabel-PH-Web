import React from 'react';

const VOLUNTEER_URL = "https://forms.gle/W6WVpftGDwM7fUm19";

interface HeroProps {
  onDonateClick: (e: React.MouseEvent) => void;
}

export const Hero: React.FC<HeroProps> = ({ onDonateClick }) => {
  const handleJoinClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!VOLUNTEER_URL) {
      e.preventDefault();
      alert("No membership application open yet");
    }
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background handled in App.tsx */}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-ocean-deep dark:text-white reveal active">
        <div className="animate-float mb-4 flex justify-center w-full">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-lobster tracking-tight drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-ocean-deep via-primary-blue to-primary-cyan dark:from-white dark:via-primary-cyan dark:to-primary-blue py-4 px-2 select-none">
            Dyesabel Philippines
          </h1>
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto mb-14 text-ocean-deep/90 dark:text-white/95 drop-shadow-md reveal reveal-delay-200 leading-relaxed px-4">
          Developing the Youth with <span className="font-black text-primary-blue dark:text-primary-cyan">
            Environmentally Sustainable Advocacies
          </span> Building and Empowering Lives.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center reveal reveal-delay-300">
          <button 
            onClick={onDonateClick}
            className="group relative px-10 py-4 bg-gradient-to-r from-primary-cyan to-primary-blue text-white font-black tracking-wider rounded-full shadow-[0_10px_40px_-10px_rgba(34,211,238,0.5)] hover:shadow-[0_15px_50px_-5px_rgba(34,211,238,0.7)] transition-all duration-300 transform hover:-translate-y-1.5 active:scale-95 text-lg overflow-hidden"
          >
            <span className="relative z-10">Donate Now</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          
          <a 
            href={VOLUNTEER_URL || '#'}
            onClick={handleJoinClick}
            target={VOLUNTEER_URL ? "_blank" : undefined}
            rel={VOLUNTEER_URL ? "noopener noreferrer" : undefined}
            className="px-10 py-4 glass-card text-ocean-deep dark:text-white font-black tracking-wider rounded-full hover:bg-white/20 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1.5 border border-ocean-deep/20 dark:border-white/30 text-lg backdrop-blur-xl flex items-center justify-center cursor-pointer active:scale-95"
          >
            Join the Movement
          </a>
        </div>
      </div>
      
      {/* Subtle indicator for scrolling */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse">
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] dark:text-white">Discover More</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary-cyan to-transparent"></div>
      </div>

      {/* Subtle gradient overlay at the bottom for section blending */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ocean-light dark:from-ocean-dark to-transparent pointer-events-none"></div>
    </section>
  );
};
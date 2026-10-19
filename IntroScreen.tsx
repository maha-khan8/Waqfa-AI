import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const fullTagline = 'Pause, but with purpose.';
  const [displayedTagline, setDisplayedTagline] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index <= fullTagline.length) {
        setDisplayedTagline(fullTagline.slice(0, index));
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 45);

    // Auto-advance after 2.6s total
    const timeout = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-900 select-none animate-in fade-in duration-300">
      <div className="max-w-md w-full text-center space-y-4">
        {/* Full Name for Intro Screen */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
          Waqfa AI
        </h1>

        {/* Animated Tagline */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-lg sm:text-xl text-teal-700 font-semibold tracking-wide">
            {displayedTagline}
            <span
              className={`inline-block w-0.5 h-5 bg-teal-600 ml-1 align-middle transition-opacity ${
                isTypingComplete ? 'opacity-0' : 'animate-pulse'
              }`}
            />
          </p>
        </div>

        <p className="text-xs text-slate-500 pt-1 font-medium">
          A purposeful gap-year planning assistant.
        </p>

        {/* Accessible Skip Action */}
        <div className="pt-6">
          <button
            onClick={onComplete}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Enter Waqfa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

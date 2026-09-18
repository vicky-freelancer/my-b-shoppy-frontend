import React from 'react';

interface GoldFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Warm gold border + cream showcase frame that wraps product grids.
 */
export const GoldFrame: React.FC<GoldFrameProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative rounded-[28px] border-[3px] sm:border-[4px] border-[#D8A83E]/60 p-4 sm:p-6 lg:p-8 bg-[#FFFDF6] shadow-[0_30px_70px_-32px_rgba(90,62,20,0.45)] ${className}`}
    >
      {/* Corner accents */}
      <span className="absolute -top-[2px] -left-[2px] sm:-top-[3px] sm:-left-[3px] w-8 h-8 border-t-[3px] border-l-[3px] sm:border-t-4 sm:border-l-4 border-[#E8C875] rounded-tl-2xl pointer-events-none"></span>
      <span className="absolute -top-[2px] -right-[2px] sm:-top-[3px] sm:-right-[3px] w-8 h-8 border-t-[3px] border-r-[3px] sm:border-t-4 sm:border-r-4 border-[#E8C875] rounded-tr-2xl pointer-events-none"></span>
      <span className="absolute -bottom-[2px] -left-[2px] sm:-bottom-[3px] sm:-left-[3px] w-8 h-8 border-b-[3px] border-l-[3px] sm:border-b-4 sm:border-l-4 border-[#E8C875] rounded-bl-2xl pointer-events-none"></span>
      <span className="absolute -bottom-[2px] -right-[2px] sm:-bottom-[3px] sm:-right-[3px] w-8 h-8 border-b-[3px] border-r-[3px] sm:border-b-4 sm:border-r-4 border-[#E8C875] rounded-br-2xl pointer-events-none"></span>

      {children}
    </div>
  );
};
import React from 'react';

interface GoldFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Thick gold border + generous padding frame that wraps
 * product grids for a luxury showcase feel.
 */
export const GoldFrame: React.FC<GoldFrameProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative rounded-[28px] border-[5px] sm:border-[8px] border-[#d4af37]/80 p-5 sm:p-8 lg:p-10 bg-gradient-to-b from-[#171512] via-[#14120f] to-[#100f0d] shadow-[0_0_70px_rgba(212,175,55,0.14)] ${className}`}
    >
      {/* Corner accents */}
      <span className="absolute -top-[3px] -left-[3px] sm:-top-[5px] sm:-left-[5px] w-8 h-8 border-t-4 border-l-4 border-[#fae19c] rounded-tl-3xl pointer-events-none"></span>
      <span className="absolute -top-[3px] -right-[3px] sm:-top-[5px] sm:-right-[5px] w-8 h-8 border-t-4 border-r-4 border-[#fae19c] rounded-tr-3xl pointer-events-none"></span>
      <span className="absolute -bottom-[3px] -left-[3px] sm:-bottom-[5px] sm:-left-[5px] w-8 h-8 border-b-4 border-l-4 border-[#fae19c] rounded-bl-3xl pointer-events-none"></span>
      <span className="absolute -bottom-[3px] -right-[3px] sm:-bottom-[5px] sm:-right-[5px] w-8 h-8 border-b-4 border-r-4 border-[#fae19c] rounded-br-3xl pointer-events-none"></span>

      {children}
    </div>
  );
};

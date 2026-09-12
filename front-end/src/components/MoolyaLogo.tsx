import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Navbar Logo: Renders the uncropped /logo.png scaled down proportionally by height.
 * Uses object-fit: contain (height: 40-48px; width: auto) without any clipping or cropping.
 */
export function MoolyaIcon({ className = 'h-10 sm:h-12 w-auto', size }: LogoProps) {
  const style = size ? { height: `${size}px`, width: 'auto' } : undefined;

  return (
    <img
      src="/logo.png"
      alt="Moolya Logo"
      className={`object-contain max-h-12 w-auto shrink-0 ${className}`}
      style={style}
    />
  );
}

/**
 * Full Logo Header for Login & Signup pages: Renders the uncropped /logo.png.
 * Sized larger (height: 120-160px) and fully visible with object-fit: contain.
 */
export function MoolyaFullLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <img
        src="/logo.png"
        alt="MOOLYA - Farmer-to-Buyer"
        className="h-32 sm:h-40 max-w-full object-contain drop-shadow-xs"
      />
    </div>
  );
}

export default MoolyaFullLogo;

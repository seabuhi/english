'use client';

import React from 'react';

interface BackgroundVideoProps {
  videoSrc?: string;
  opacity?: number; // 0 to 1
  overlayColor?: string;
}

export default function BackgroundVideo({
  videoSrc = '/background.mp4',
  opacity = 0.25,
  overlayColor = 'bg-[#08090f]/80'
}: BackgroundVideoProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover scale-105 filter saturate-[0.6] contrast-110"
        style={{ opacity }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-radial-gradient" />
      <div className={`absolute inset-0 ${overlayColor} backdrop-blur-[1px]`} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090f]/50 via-transparent to-[#08090f]" />
    </div>
  );
}


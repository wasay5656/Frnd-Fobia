import React from 'react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
  showPlaceholder?: boolean;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = '0000000000',
  format = 'horizontal',
  className = '',
  showPlaceholder = false, // Kept hidden until real AdSense script is injected
}) => {
  // If not configured with a live AdSense client ID and showPlaceholder is false, keep hidden as requested
  const hasLiveAdSense = typeof window !== 'undefined' && Boolean((window as any).adsbygoogle);

  if (!hasLiveAdSense && !showPlaceholder) {
    return (
      <div
        id={`adsense-slot-${slotId}`}
        className="hidden"
        data-ad-slot={slotId}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`w-full flex flex-col items-center my-6 ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-mono">
        Advertisement
      </span>

      {/* Google AdSense container */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: format === 'horizontal' ? '90px' : '250px' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slotId}
        data-ad-format={format === 'horizontal' ? 'horizontal' : 'rectangle'}
        data-full-width-responsive="true"
      />
    </div>
  );
};

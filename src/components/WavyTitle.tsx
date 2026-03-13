import { useEffect, useRef } from 'react';

/**
 * WavyTitle — renders two lines of mouse-reactive wavy text
 * using the css-doodle web component (loaded globally in index.html).
 *
 * Inspired by the "pure-wavy-move-mouse" demo from creativesouth.com.
 * Each line gets 5 stacked color layers that rotate/translate on pointer move.
 */
export default function WavyTitle() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // css-doodle renders on first connect; if the script loaded after React mount
    // we may need to nudge it. A short timeout handles both orderings.
    const timer = setTimeout(() => {
      containerRef.current?.querySelectorAll('css-doodle').forEach((el: any) => {
        if (typeof el.update === 'function') el.update();
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const line1Style = `
    @grid: 5x1 / 100% 100%;
    @content: 'Algorithmic Rigor.';
    @place: center;
    @size: 100% 0;
    color: @pn(#ffffff, rgba(0,255,163,0.35), rgba(0,229,255,0.25), rgba(124,92,255,0.15), rgba(64,64,96,0.08));
    z-index: @I(-@i);
    font-weight: bold;
    font-size: clamp(1.8rem, 5vw, 4.5rem);
    line-height: 0;
    -webkit-text-stroke: 0;
    transition: @i(*.03s);
    scale: calc(1 - .015 * @i);
    rotate: calc(2deg/@uw*(@ux - @uw/2) * @dx(-2));
    translate: 0 calc(0.6vh/@uh*(@uy - @uh/2) * @dx(-2));
    font-family: var(--font-display), system-ui, sans-serif;
    letter-spacing: -0.04em;
    white-space: nowrap;
  `;

  const line2Style = `
    @grid: 5x1 / 100% 100%;
    @content: 'True to life Analysis';
    @place: center;
    @size: 100% 0;
    color: @pn(rgba(255,255,255,0.55), rgba(0,255,163,0.25), rgba(0,229,255,0.18), rgba(124,92,255,0.1), rgba(64,64,96,0.05));
    z-index: @I(-@i);
    font-weight: bold;
    font-size: clamp(1.8rem, 5vw, 4.5rem);
    line-height: 0;
    -webkit-text-stroke: 0;
    transition: @i(*.03s);
    scale: calc(1 - .015 * @i);
    rotate: calc(2deg/@uw*(@ux - @uw/2) * @dx(-2));
    translate: 0 calc(0.6vh/@uh*(@uy - @uh/2) * @dx(-2));
    font-family: var(--font-display), system-ui, sans-serif;
    letter-spacing: -0.04em;
    white-space: nowrap;
  `;

  return (
    <div ref={containerRef} className="wavy-title-wrapper">
      <div className="wavy-title-line">
        {/* @ts-ignore — css-doodle is a web component */}
        <css-doodle>{line1Style}</css-doodle>
      </div>
      <div className="wavy-title-line">
        {/* @ts-ignore — css-doodle is a web component */}
        <css-doodle>{line2Style}</css-doodle>
      </div>
    </div>
  );
}

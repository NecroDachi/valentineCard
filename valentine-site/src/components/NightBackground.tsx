import { useEffect, useMemo, useState } from "react";

type NightBackgroundProps = {
  step: number;
};

export default function NightBackground({ step }: NightBackgroundProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (step === 2) {
      requestAnimationFrame(() => setFadeIn(true)); // trigger fade
    } else {
      setFadeIn(false);
    }
  }, [step]);

  // Fireflies generated once
  const fireflies = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: Math.random() * 30,
        delay: 1 + Math.random() * 4,
        duration: 6 + Math.random() * 6,
        size: 4 + Math.random() * 4,
      })),
    []
  );

  return (
    <>
      {/* Fullscreen night background */}
      <div
        className="fixed inset-0 bg-black z-0 transition-opacity duration-[2000ms]"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        <div className="absolute inset-0 night-bg" />
      </div>

      {/* Fireflies */}
      <div
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-[2000ms]"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        {fireflies.map((f) => (
          <div
            key={f.id}
            className="firefly"
            style={{
              left: `${f.left}%`,
              bottom: `${f.bottom}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        .night-bg {
          background:
            radial-gradient(
              ellipse at top,
              rgba(255,255,255,0.06),
              transparent 60%
            ),
            linear-gradient(to bottom, #020617, #000000);
        }

        .firefly {
          position: absolute;
          background: pink;
          border-radius: 9999px;
          filter: blur(2px);
          opacity: 0;
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes float {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate(40px, -120vh);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

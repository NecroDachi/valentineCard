  import { useState, useEffect } from "react";
  import NightBackground from "./NightBackground";
  import catFront from "./cat-front.png";
  import catBack from "./cat-back.png";
  import heart from "./heart.png";
  import catvideo from "./cat-video.webm";

  interface PlsText {
    top: number;
    left: number;
    rotation: number;
    content: string;
  }

  const VIDEO_CUT_TIME = 5; 

  export default function Paper() {
    const [step, setStep] = useState(0);
    const [showText, setShowText] = useState(false);
    const [swapped, setSwapped] = useState(false);
    const [plsTexts, setPlsTexts] = useState<PlsText[]>([]);
    const [showVideo, setShowVideo] = useState(false);
    const [videoFull, setVideoFull] = useState(false);
    const [hearts, setHearts] = useState<number[]>([]);
    const [showFinalText, setShowFinalText] = useState(false);

    const unfold = () => setStep((s) => Math.min(s + 1, 2));

    const words = [
      "please",
      "plz",
      "pleeeease",
      "plz",
      "plsss",
      "whimpers",
    ];
useEffect(() => {
  if (!showVideo) return;

  const timer = setTimeout(() => {
    setShowVideo(false);      // end video
    setShowFinalText(true);   // show new text AFTER video
  }, VIDEO_CUT_TIME * 1000);

  return () => clearTimeout(timer);
}, [showVideo]);


    // Hover handler for NO button
    const handleNoHover = () => {
      setSwapped((prev) => !prev);

      // Generate a new plsText without overlapping
      const maxAttempts = 50;
      let attempt = 0;
      let newPos: PlsText | null = null;

      while (attempt < maxAttempts && !newPos) {
        const candidate = {
          top: Math.random() * 60 + 10, // 10% - 70% vertical
          left: Math.random() * 80 + 10, // 10% - 90% horizontal
          rotation: Math.random() * 60 - 30, // -30° to 30°
          content: words[Math.floor(Math.random() * words.length)],
        };
        // Check for overlap with existing plsTexts (simple bounding box)
        const overlap = plsTexts.some(
          (t) =>
            Math.abs(t.top - candidate.top) < 5 && Math.abs(t.left - candidate.left) < 10
        );
        if (!overlap) newPos = candidate;
        attempt++;
      }
      if (newPos) setPlsTexts((prev) => [...prev, newPos]);
    };

    useEffect(() => {
      if (step === 2) {
        const timer = setTimeout(() => setShowText(true), 1000);
        return () => clearTimeout(timer);
      } else {
        setShowText(false);
      }
    }, [step]);

    const handleYesClick = () => {
      setPlsTexts([]);
      setShowText(false);
      setShowVideo(true);

      // spawn hearts
      setHearts(Array.from({ length: 24 }, (_, i) => i));

      requestAnimationFrame(() => {
        setVideoFull(true);
      });

      // clean hearts after animation
      setTimeout(() => {
        setHearts([]);
      }, 1500);
    };



    return (
      <>
        <NightBackground step={step} />
        <div className="w-screen h-screen bg-black flex items-center justify-center relative overflow-hidden">
          <div style={{ perspective: "1400px" }} className="relative">
            <img
              src={catBack}
              className="absolute z-10 transition-all duration-[3000ms]"
              style={{
                width: "500px",
                bottom: step >= 2 ? "10%" : "-20%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: step >= 2 ? 1 : 0,
              }}
            />

            <div
              className="relative w-[512px] h-[320px] z-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-50" />
              <div
                className="absolute left-0 top-0 w-1/2 bg-red-50 transition-transform duration-500"
                style={{
                  height: "calc(50% + 1px)",
                  transformOrigin: "bottom",
                  transform:
                    step >= 1
                      ? "rotateX(0deg) translateZ(0.1px)"
                      : "rotateX(-180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
              <div
                className="absolute right-0 top-0 w-1/2 h-full bg-red-50 transition-transform duration-500"
                style={{
                  transformOrigin: "left",
                  transform:
                    step >= 2
                      ? "rotateY(0deg) translateZ(0.1px)"
                      : "rotateY(-180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>

            <img
              src={catFront}
              className="absolute z-30 transition-all duration-[1900ms]"
              style={{
                width: "500px",
                bottom: step >= 2 ? "10%" : "1000%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: step >= 2 ? 1 : 0,
              }}
            />
            <img
              src={heart}
              className="absolute z-30 transition-all duration-[1900ms]"
              style={{
                width: "100px",
                bottom: "80%",
                left: step >= 2 ? "95%" : "100%",
                transform:
                  step >= 2
                    ? "translateX(-50%) rotate(30deg)"
                    : "translateX(0) rotate(30deg)",
                opacity: step >= 2 ? 1 : 0,
              }}
            />

            {showText && (
              <div className="absolute inset-0 z-40 pointer-events-none">
                <div
                  className="absolute"
                  style={{
                    top: "18%",
                    left: "15%",
                    fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                    fontSize: "3.5rem",
                    color: "#f472b6",
                    opacity: 0,
                    animation: "fadeIn 1s forwards",
                  }}
                >
                  WiLL
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "45%",
                    left: "45%",
                    fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                    fontSize: "1.2rem",
                    color: "#f472b6",
                    opacity: 0,
                    animation: "fadeIn 1s forwards 0.3s",
                  }}
                >
                  YOU be my
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "52%",
                    left: "18%",
                    fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                    fontSize: "5rem",
                    color: "#f472b6",
                    opacity: 0,
                    animation: "fadeIn 1s forwards 0.6s",
                  }}
                >
                  Valentine?
                </div>
              </div>
            )}
          </div>

          {step < 2 ? (
            <button
              onClick={unfold}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black rounded-full shadow-lg active:scale-95"
            >
              Unfold
            </button>
          ) : !showVideo && !showFinalText ? (
            <div
              className="fixed bottom-28 left-1/2 -translate-x-1/2 flex gap-10 transition-all duration-300"
              style={{ flexDirection: swapped ? "row-reverse" : "row" }}
            >

              <button
                className="relative px-10 py-5 bg-pink-400 text-white font-bold rounded-xl text-2xl shadow-lg active:scale-95 hover:bg-pink-500 transition"
                style={{
                  fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                  opacity: 0,
                  animation: "fadeIn 1s forwards 2s",
                }}
                onClick={handleYesClick}
              >
                YES
                <span className="absolute top-1 left-2 w-full h-full border-4 border-gray-100 rounded-xl pointer-events-none"></span>
              </button>

              <button
                className="relative px-10 py-5 bg-gray-300 text-black font-bold rounded-xl text-2xl shadow-lg active:scale-95 hover:bg-gray-400 transition"
                style={{
                  fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                  opacity: 0,
                  animation: "fadeIn 1s forwards 2s",
                }}
                onMouseEnter={handleNoHover}
              >
                NO
                <span className="absolute top-1 left-2 w-full h-full border-4 border-gray-100 rounded-xl pointer-events-none"></span>
              </button>
            </div>
          ): null }
          {showVideo && (
          <video
            src={catvideo}
            autoPlay
            muted
            playsInline
            onEnded={() => setShowVideo(false)}
            className="absolute z-[999] transition-transform duration-[1200ms] ease-in-out"
            style={{
              top: "50%",
              left: "50%",
              transform: videoFull
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.05)",
              width: "100vw",
              height: "100vh",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        )}
          {showFinalText && (
            <div className="absolute inset-0 z-50 pointer-events-none">
                <div
                  className="absolute"
                  style={{
                    top: "35%",
                    left: "40%",
                    fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                    fontSize: "3.5rem",
                    color: "#f472b6",
                    opacity: 0,
                    animation: "fadeIn 1s forwards",
                  }}
                >
                  YiPPie!
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "48%",
                    left: "45%",
                    fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                    fontSize: "1.2rem",
                    color: "#f472b6",
                    opacity: 0,
                    animation: "fadeIn 1s forwards 0.3s",
                  }}
                >
                  movie / game night 
                </div>
                <div
                  className="absolute"
                  style={{
                    top: "52%",
                    left: "38%",
                    fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                    fontSize: "4rem",
                    color: "#f472b6",
                    opacity: 0,
                    animation: "fadeIn 1s forwards 0.6s",
                  }}
                >
                  on February 14!
                </div>
            </div>
          )}


          {hearts.map((h) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 300 + 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <div
                key={h}
                className="absolute z-[998] text-pink-400"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: `heart-float 1.4s ease-out forwards`,
                  "--x": `${x}px`,
                  "--y": `${y}px`,
                  fontSize: `${Math.random() * 20 + 20}px`,
                } as React.CSSProperties}
              >
                ❤️
              </div>
            );
          })}

          {plsTexts.map((t, i) => (
            <div
              key={i}
              className="absolute text-white font-bold pointer-events-none select-none"
              style={{
                zIndex: 0, 
                top: `${t.top}%`,
                left: `${t.left}%`,
                transform: `rotate(${t.rotation}deg)`,
                fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
              }}
            >
              {t.content}
            </div>
          ))}

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes heart-float {
              0% {
                transform: translate(-50%, -50%) scale(0.3);
                opacity: 1;
              }
              100% {
                transform: translate(
                    calc(-50% + var(--x)),
                    calc(-50% + var(--y))
                  )
                  scale(1.2);
                opacity: 0;
              }
            }

          `}
          
          </style>
        </div>
      </>
    );
  }

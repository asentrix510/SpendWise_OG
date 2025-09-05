import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(GSAPSplitText);

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !text) return;
    const el = ref.current;
    let splitter;

    const runAnimation = () => {
      if (splitter) splitter.revert(); // reset any previous split

      splitter = new GSAPSplitText(el, {
        type: splitType,
        linesClass: "split-line",
      });

      let targets;
      switch (splitType) {
        case "lines":
          targets = splitter.lines;
          break;
        case "words":
          targets = splitter.words;
          break;
        default:
          targets = splitter.chars;
      }

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          onComplete: () => onLetterAnimationComplete?.(),
        }
      );
    };

    // ✅ Run animation on click
    el.addEventListener("click", runAnimation);

    return () => {
      el.removeEventListener("click", runAnimation);
      if (splitter) splitter.revert();
    };
  }, [text, delay, duration, ease, splitType, from, to, onLetterAnimationComplete]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        cursor: "pointer", // 👈 makes it clear it’s clickable
      }}
    >
      {text}
    </p>
  );
};

export default SplitText;

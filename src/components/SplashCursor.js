import React, { useEffect } from "react";
 // using .splash-cursor class from your CSS

export default function SplashCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("splash-cursor");
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      // 🎨 trailing effect
      const trail = document.createElement("div");
      trail.classList.add("splash-cursor");
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      trail.style.opacity = "0.6";
      trail.style.transform = "translate(-50%, -50%) scale(0.7)";
      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 400); // trail fades out
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      cursor.remove();
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return null;
}

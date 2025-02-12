"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import LeanCodersQr from "./lean-coders-qr";

const prizes = {
  "🧦": { name: "Socken", color: "#FF9103" },
  "🎁": { name: "Goodie Bag", color: "#80EB52" },
  "🥤": { name: "Red Bull", color: "#F4343E" },
  "🍬": { name: "Skittles", color: "#46C3EF" },
  "❌": { name: "Kein Gewinn", color: "#454751" },
};

const segments: (keyof typeof prizes)[] = ["🥤", "🍬", "🎁", "❌", "🧦", "🥤", "🍬", "🎁", "❌", "🧦"];

const radToDeg = (rad: number) => rad * (180 / Math.PI);

export default function SpinWheel() {
  const wheelRef = useRef<SVGSVGElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const svg = wheelRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.lastChild as Node);
    }

    const radius = 50;
    const sliceAngle = (2 * Math.PI) / segments.length;

    segments.forEach((icon, index) => {
      const angle = index * sliceAngle;
      const x = 50 + radius * Math.sin(angle);
      const y = 50 - radius * Math.cos(angle);

      const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
      slice.setAttribute(
        "d",
        `M50,50 L${x},${y} A${radius},${radius} 0 0,1 ${50 + radius * Math.sin(angle + sliceAngle)},${50 - radius * Math.cos(angle + sliceAngle)} Z`
      );
      slice.setAttribute("fill", prizes[icon].color);
      slice.setAttribute("stroke", "white");
      slice.setAttribute("stroke-width", "0.5");
      svg.appendChild(slice);

      const textAngle = angle + sliceAngle / 2;
      const textX = 50 + (radius - 15) * Math.sin(textAngle);
      const textY = 50 - (radius - 15) * Math.cos(textAngle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", `${textX}`);
      text.setAttribute("y", `${textY}`);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("alignment-baseline", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "10");
      text.setAttribute("transform", `rotate(${radToDeg(textAngle)}, ${textX}, ${textY})`);
      text.textContent = icon;
      svg.appendChild(text);
    });
  }, []);

  const spinWheel = () => {
    if (!wheelRef.current || segments.length < 2) return;

    setIsSpinning(true);
    wheelRef.current.style.transform = `rotate(0deg)`;

    const degree = Math.random() * 360 + 5 * 360;
    wheelRef.current.style.transition = "transform 2.5s ease-in-out";
    wheelRef.current.style.transform = `rotate(${degree}deg)`;

    setTimeout(() => {
      if (!wheelRef.current) return;
      const adjustedAngle = degree % 360;
      const sliceAngle = 360 / segments.length;
      const index = Math.floor((360 - adjustedAngle) / sliceAngle);

      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = `rotate(${adjustedAngle}deg)`;
      setIsSpinning(false);

      if (segments[index] !== "❌") {
        setTimeout(
          () =>
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            }),
          250
        );
      }
    }, 2500);
  };

  return (
    <div className="p-12 space-y-12">
      <div className="relative">
        <svg viewBox="0 0 100 100" ref={wheelRef} className="border-2 border-white rounded-full max-w-[500px] max-h-[500px] m-auto"></svg>
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0 h-5 border-t-[30px] border-l-[20px] border-r-[20px] border-t-white border-x-transparent z-10"></div>
        <LeanCodersQr className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />
      </div>

      <div className="text-center">
        <Button onClick={spinWheel} disabled={isSpinning} size="lg" className="transition-all text-lg py-6 rounded-xl">
          {isSpinning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Spinning...
            </>
          ) : (
            "Spin the Wheel!"
          )}
        </Button>
      </div>

      <div className="w-max mx-auto bg-white/90 rounded-lg shadow-lg py-6 px-16">
        <h3 className="text-lg font-bold mb-3 text-center">Preise</h3>
        <div className="grid grid-cols-1 gap-2 w-max mx-auto">
          {Object.keys(prizes).map((icon, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{icon}</span>
              <span>{prizes[icon as keyof typeof prizes].name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

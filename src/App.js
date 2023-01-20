import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./styles.css";

function PotteryWheel() {
  // Create a reference for the wheel element
  const wheelRef = useRef(null);

  // Create a state variable to store the duration of the rotation animation
  const [duration, setDuration] = useState(10);

  // Create a reference for the SVG canvas element
  const canvasRef = useRef(null);

  // Create a state variable to keep track of whether the mouse is currently held down
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Create a state variable to store the current path
  const [path, setPath] = useState(null);

  // Function to handle mousedown events on the canvas and start drawing a new path
  const [intervalId, setIntervalId] = useState(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleCanvasMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseDown = (e) => {
    setIsMouseDown(true);
    startPath(e);
  };

  const handleCanvasMouseUp = (e) => {
    setIsMouseDown(false);
    clearInterval(intervalId);
    setPath(null);
  };

  // Function to start drawing a new path
  const startPath = (e) => {
    const svg = canvasRef.current;
    const pt = svg.createSVGPoint();
    pt.x = mousePosition.x;
    pt.y = mousePosition.y;
    const canvasCoords = pt.matrixTransform(svg.getScreenCTM().inverse());

    const newPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    newPath.setAttribute("fill", "none");
    newPath.setAttribute("stroke", "green");
    newPath.setAttribute("stroke-width", "10");
    newPath.setAttribute("stroke-linecap", "round");

    newPath.setAttribute("d", `M ${canvasCoords.x},${canvasCoords.y}`);
    svg.appendChild(newPath);
    setPath(newPath);
    //  console.log("started");
    const interval = setInterval(() => updatePath(e, newPath), 2);
    setIntervalId(interval);
  };

  // Function to update the current path on mouse move
  const updatePath = (e, newPath) => {
    if (!newPath) return;
    const svg = canvasRef.current;
    const pt = svg.createSVGPoint();
    pt.x = mousePosition.x;
    pt.y = mousePosition.y;
    const canvasCoords = pt.matrixTransform(svg.getScreenCTM().inverse());
    console.log(canvasCoords.x);
    newPath.setAttribute(
      "d",
      `${newPath.getAttribute("d")} L ${canvasCoords.x},${canvasCoords.y}`
    );
    svg.appendChild(newPath);
  };
  // Use useEffect to apply the rotation animation on mount
  useEffect(() => {
    gsap.to(wheelRef.current, {
      duration,
      rotation: "+=360",
      transformOrigin: "50% 50%",
      ease: "none",
      repeat: -1
    });
  }, [duration]);

  return (
    <div className="pottery-wheel">
      <div className="controls">
        <button onClick={() => setDuration(Math.min(duration - 1), 1)}>
          +
        </button>
        <button onClick={() => setDuration(Math.max(duration + 1, 1))}>
          -
        </button>
      </div>

      <div className="wheel" ref={wheelRef}>
        <svg
          width="500"
          height="500"
          ref={canvasRef}
          onMouseDown={(e) => {
            handleCanvasMouseDown(e);
          }}
          onMouseUp={(e) => {
            handleCanvasMouseUp(e);
          }}
          onMouseMove={(e) => {
            handleCanvasMouseMove(e);
          }}
        ></svg>
      </div>
    </div>
  );
}

export default PotteryWheel;

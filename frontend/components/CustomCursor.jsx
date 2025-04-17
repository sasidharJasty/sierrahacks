import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [clickEffect, setClickEffect] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [bubblePosition, setBubblePosition] = useState("top"); // 'top' or 'bottom'
  
  const cursorRef = useRef(null);
  const lastElementRef = useRef(null);
  
  // Handle mouse move to update cursor position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      if (!isVisible && e.clientX > 0 && e.clientY > 0) {
        setIsVisible(true);
      }
      
      // Determine bubble position based on cursor position
      const topThreshold = 80; // Buffer for top edge
      setBubblePosition(e.clientY <= topThreshold ? "bottom" : "top");
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible]);
  
  // Handle mouse down and up events
  useEffect(() => {
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => {
      setIsClicked(false);
      
      // Create simple click effect - just one circle
      setClickEffect({
        id: `click-${Date.now()}`,
        x: position.x,
        y: position.y,
        color
      });
      
      // Remove the effect after animation completes
      setTimeout(() => {
        setClickEffect(null);
      }, 800);
    };
    
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [position, color]);
  
  // Detect interactive elements
  useEffect(() => {
    const handleElementDetection = () => {
      const element = document.elementFromPoint(position.x, position.y);
      
      // Skip unnecessary processing if element hasn't changed
      if (element === lastElementRef.current) return;
      lastElementRef.current = element;
      
      if (element) {
        // Detect if element or its parent is interactive
        const computedStyle = window.getComputedStyle(element);
        
        // Check for text content
        const hasTextContent = element.innerText?.trim().length > 0;
        const isTextContainer = 
          element.tagName === "P" || 
          element.tagName === "SPAN" ||
          element.tagName === "H1" || 
          element.tagName === "H2" || 
          element.tagName === "H3" || 
          element.tagName === "H4" || 
          element.tagName === "H5" || 
          element.tagName === "H6" ||
          element.tagName === "DIV" && hasTextContent ||
          computedStyle.cursor === "text";
        
        // Check for interactive elements
        const isPointerElement = 
          computedStyle.cursor === "pointer" || 
          element.tagName === "A" || 
          element.tagName === "BUTTON" ||
          element.onclick || 
          element.closest("a") || 
          element.closest("button") ||
          element.getAttribute("role") === "button" ||
          element.classList.contains("clickable");
        
        // Check for custom cursor attributes first, they take precedence
        const cursorText = element.getAttribute("data-cursor-text") || 
                          element.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");
        
        // If there's custom cursor text, treat as pointer
        if (cursorText) {
          setIsPointer(true);
          setIsText(false);
          setText(cursorText);
        } else {
          // Normal detection behavior
          setIsPointer(isPointerElement);
          
          // We still track isText but we don't use the I-beam cursor anymore
          setIsText(isTextContainer && !isPointerElement);
          setText("");
        }
        
        // Get custom color
        const cursorColor = element.getAttribute("data-cursor-color") || 
                            element.closest("[data-cursor-color]")?.getAttribute("data-cursor-color");
        
        // Set default color if none is specified
        if (cursorColor) {
          setColor(cursorColor);
        } else if (isPointerElement && !cursorColor) {
          setColor("#3B82F6"); // Default color for interactive elements
        } else if (isTextContainer && !cursorColor && !isPointerElement) {
          setColor("#6B7280"); // Default color for text elements
        } else {
          setColor("#3B82F6"); // Default color
        }
      } else {
        // Reset to default cursor when not over any element
        setIsPointer(false);
        setIsText(false);
        setText("");
        setColor("#3B82F6");
      }
    };
    
    const throttledDetection = throttle(handleElementDetection, 100);
    window.addEventListener("mousemove", throttledDetection);
    
    return () => window.removeEventListener("mousemove", throttledDetection);
  }, [position]);
  
  // Hide real cursor
  useEffect(() => {
    document.body.style.cursor = "none";
    
    // Add cursor-none to all interactive elements
    const elements = document.querySelectorAll("a, button, input, [onClick], [role='button'], .clickable");
    elements.forEach(el => {
      el.classList.add("cursor-none");
    });
    
    return () => {
      document.body.style.cursor = "";
      elements.forEach(el => {
        el.classList.remove("cursor-none");
      });
    };
  }, []);
  
  // Utility function for throttling
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  }
  
  return (
    <>
      {/* Single click effect circle */}
      <AnimatePresence>
        {clickEffect && (
          <motion.div
            key={clickEffect.id}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
              position: "fixed",
              left: clickEffect.x,
              top: clickEffect.y,
              zIndex: 9999,
              pointerEvents: "none",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: clickEffect.color,
              transform: "translate(-50%, -50%)"
            }}
          />
        )}
      </AnimatePresence>
    
      {/* Main cursor outer */}
      <motion.div
        ref={cursorRef}
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicked ? 0.8 : isPointer ? 1.2 : isText ? 0.9 : 0.8,
          opacity: isVisible ? 1 : 0,
          borderColor: isPointer ? color : isText ? "#6B7280" : "white"
        }}
        transition={{
          type: "spring",
          mass: 0.2,
          stiffness: 800,
          damping: 30,
        }}
        style={{
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
          mixBlendMode: "difference", 
          width: isPointer ? "40px" : "16px",
          height: isPointer ? "40px" : "16px",
          borderRadius: "50%",
          border: `1.5px solid`,
          backgroundColor: "transparent",
          transform: "translate(-50%, -50%)",
          boxShadow: isPointer ? `0 0 10px ${color}40` : "none"
        }}
      />
      
      {/* Cursor inner */}
      <motion.div
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicked ? 1 : isPointer ? 0 : 0.25,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isClicked ? "white" : isText ? "#6B7280" : color
        }}
        transition={{
          type: "spring",
          mass: 0.1,
          stiffness: 1000,
          damping: 30,
        }}
        style={{
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      
      {/* Text bubble - with smart positioning */}
      <AnimatePresence>
        {text && isPointer && (
          <motion.div
            initial={{ opacity: 0, y: bubblePosition === "top" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: bubblePosition === "top" ? 5 : -5 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              zIndex: 9999,
              pointerEvents: "none",
              left: position.x,
              top: position.y + (bubblePosition === "top" ? -40 : 40),
              transform: "translateX(-50%)",
              backgroundColor: color,
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              fontWeight: 600,
              letterSpacing: "0.5px"
            }}
          >
            {text}
            {/* Arrow pointing to cursor - conditionally positioned */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                [bubblePosition === "top" ? "bottom" : "top"]: "-4px",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                [`border${bubblePosition === "top" ? "Bottom" : "Top"}`]: `5px solid ${color}`
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
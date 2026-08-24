import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../src/lib/utils";

const StarfieldBackground = ({
  className,
  children,
  count = 400,
  speed = 0.5,
  starColor = "#ffffff",
  twinkle = true,
  parallax = false,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, (value) => value * -0.12);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let animationId;
    let tick = 0;
    const maxDepth = 1500;

    const createStar = (initialZ) => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: initialZ ?? Math.random() * maxDepth,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    });

      let stars = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = "#000000";
        if (stars.length === 0) {
          stars = Array.from({ length: count }, () => createStar());
        }
      context.fillRect(0, 0, width, height);
    };

    const animate = () => {
      tick += 1;
      context.fillStyle = "rgba(0, 0, 0, 0.2)";
      context.fillRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      for (const star of stars) {
        star.z -= speed * 2;
        if (star.z <= 0) {
          Object.assign(star, createStar(maxDepth));
        }

        const scale = 400 / star.z;
        const x = centerX + star.x * scale;
        const y = centerY + star.y * scale;
        if (x < -10 || x > width + 10 || y < -10 || y > height + 10) continue;

        const size = Math.max(0.5, (1 - star.z / maxDepth) * 3);
        let opacity = (1 - star.z / maxDepth) * 0.9 + 0.1;
        if (twinkle && star.twinkleSpeed > 0.015) {
          opacity *= 0.7 + 0.3 * Math.sin(tick * star.twinkleSpeed + star.twinkleOffset);
        }

        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fillStyle = starColor;
        context.globalAlpha = opacity;
        context.fill();

        if (star.z < maxDepth * 0.3 && speed > 0.3) {
          const streakLength = (1 - star.z / maxDepth) * speed * 8;
          const angle = Math.atan2(star.y, star.x);
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x - Math.cos(angle) * streakLength, y - Math.sin(angle) * streakLength);
          context.strokeStyle = starColor;
          context.globalAlpha = opacity * 0.3;
          context.lineWidth = size * 0.5;
          context.stroke();
        }
      }

      context.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [count, speed, starColor, twinkle]);

  return (
    <motion.div ref={containerRef} style={parallax ? { y: parallaxY } : undefined} className={cn("pointer-events-none fixed left-0 right-0 top-[8%] bottom-[-20%] z-0 overflow-hidden bg-black", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(14, 67, 182, 0.18) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(24, 74, 160, 0.1) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.88) 100%)",
        }}
      />
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </motion.div>
  );
};

export default StarfieldBackground;

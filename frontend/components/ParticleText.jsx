import { useEffect, useRef } from "react";

const ParticleText = ({
  text,
  particleSize = 2.2,
  density = 4,
  color = "#f8fafc",
  highlightColor = "#8b5cf6",
  scatter = 190,
  gatherDuration = 1600,
  stagger = 420,
  pointerRepel = 42,
  repelRadius = 120,
  idleDrift = 0.8,
  trigger = "mount",
  fontSize = "clamp(3.5rem, 13vw, 9rem)",
  fontWeight = 800,
  fontFamily = "inherit",
  glow = false,
}) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return undefined;

    const context = canvas.getContext("2d");
    const pointer = { x: -1000, y: -1000 };
    let particles = [];
    let animationFrame;
    let resizeObserver;
    let startedAt = trigger === "mount" ? performance.now() : null;

    const getFontSize = () => {
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;visibility:hidden;font:${fontWeight} ${fontSize} ${fontFamily};`;
      probe.textContent = text;
      document.body.appendChild(probe);
      const size = parseFloat(getComputedStyle(probe).fontSize);
      probe.remove();
      return size;
    };

    const createParticles = () => {
      const rect = wrapper.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const font = getFontSize();
      const resolvedFontFamily = fontFamily === "inherit"
        ? getComputedStyle(wrapper).fontFamily || "sans-serif"
        : fontFamily;
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.round(width * pixelRatio);
      offscreen.height = Math.round(height * pixelRatio);
      const offscreenContext = offscreen.getContext("2d");
      offscreenContext.scale(pixelRatio, pixelRatio);
      offscreenContext.fillStyle = "white";
      offscreenContext.font = `${fontWeight} ${font}px ${resolvedFontFamily}`;
      offscreenContext.textAlign = "center";
      offscreenContext.textBaseline = "middle";

      let fittedFont = font;
      while (offscreenContext.measureText(text).width > width * 0.92 && fittedFont > 24) {
        fittedFont -= 2;
        offscreenContext.font = `${fontWeight} ${fittedFont}px ${resolvedFontFamily}`;
      }
      offscreenContext.fillText(text, width / 2, height / 2);

      const pixels = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height).data;
      const step = Math.max(2, Math.round(density * pixelRatio));
      const nextParticles = [];

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          if (pixels[(y * offscreen.width + x) * 4 + 3] > 100) {
            const targetX = x / pixelRatio;
            const targetY = y / pixelRatio;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * scatter;
            nextParticles.push({
              targetX,
              targetY,
              x: targetX + Math.cos(angle) * distance,
              y: targetY + Math.sin(angle) * distance,
              size: particleSize * (0.7 + Math.random() * 0.65),
              phase: Math.random() * Math.PI * 2,
              delay: Math.random() * stagger,
            });
          }
        }
      }

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = nextParticles;
      startedAt = performance.now();
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const animate = (time) => {
      const elapsed = time - (startedAt || time);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      context.shadowBlur = glow ? 12 : 0;
      context.shadowColor = highlightColor;

      particles.forEach((particle) => {
        const progress = Math.min(1, Math.max(0, (elapsed - particle.delay) / gatherDuration));
        const eased = 1 - Math.pow(1 - progress, 3);
        const driftX = Math.sin(time * 0.001 + particle.phase) * idleDrift;
        const driftY = Math.cos(time * 0.0012 + particle.phase) * idleDrift;
        let x = particle.x + (particle.targetX - particle.x) * eased + driftX;
        let y = particle.y + (particle.targetY - particle.y) * eased + driftY;
        const distanceX = x - pointer.x;
        const distanceY = y - pointer.y;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < repelRadius && distance > 0) {
          const force = (1 - distance / repelRadius) * pointerRepel;
          x += (distanceX / distance) * force;
          y += (distanceY / distance) * force;
          context.fillStyle = highlightColor;
        } else {
          context.fillStyle = color;
        }

        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    createParticles();
    resizeObserver = new ResizeObserver(createParticles);
    resizeObserver.observe(wrapper);
    wrapper.addEventListener("pointermove", handlePointerMove);
    wrapper.addEventListener("pointerleave", handlePointerLeave);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      wrapper.removeEventListener("pointermove", handlePointerMove);
      wrapper.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [color, density, fontFamily, fontSize, fontWeight, gatherDuration, glow, highlightColor, idleDrift, particleSize, pointerRepel, repelRadius, scatter, stagger, text, trigger]);

  return <div ref={wrapperRef} className="relative h-[180px] w-full overflow-hidden bg-black sm:h-[220px]">
    <canvas ref={canvasRef} aria-label={text} role="img" className="absolute inset-0 h-full w-full" />
  </div>;
};

export default ParticleText;

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

/**
 * Endless ticker. The content is rendered twice and the track slides by
 * exactly half its width, so the loop is seamless. The copy is hidden from
 * screen readers. Pauses on hover.
 */
export function Marquee({ children, duration = 40, reverse = false, className = "", pauseOnHover = true }) {
  return (
    <div className={`group flex overflow-hidden marquee-mask ${className}`}>
      <div
        className={`flex w-max shrink-0 animate-marquee ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Giant type that drifts on its own and speeds up — or reverses — with the
 * visitor's scroll velocity.
 */
export function VelocityMarquee({ children, baseVelocity = -2, className = "" }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <motion.div className="flex w-max flex-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex shrink-0 items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

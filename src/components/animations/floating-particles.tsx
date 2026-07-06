"use client";

import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

/** Deterministic PRNG — same output on server and client to avoid hydration mismatch. */
function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function generateParticles(count: number, seed = 20260715): Particle[] {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }, (_, id) => ({
    id,
    x: random() * 100,
    y: random() * 100,
    size: random() * 4 + 2,
    duration: random() * 8 + 6,
    delay: random() * 4,
  }));
}

const DEFAULT_PARTICLES = generateParticles(24);

export function FloatingParticles({ count = 24 }: { count?: number }) {
  const particles =
    count === 24 ? DEFAULT_PARTICLES : generateParticles(count);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-primary/25 shadow-[0_0_8px_rgba(122,158,190,0.35)]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size + 1}px`,
            height: `${particle.size + 1}px`,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.25, 0.65, 0.25],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

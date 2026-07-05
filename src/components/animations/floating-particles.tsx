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
          className="absolute rounded-full bg-white/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
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

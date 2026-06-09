import { Variants } from "framer-motion";

// Fade in animation variants
export const fadeIn = (direction: "up" | "down" | "left" | "right" = "up", delay: number = 0): Variants => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay,
        duration: 0.5,
      },
    },
  };
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Scale animation
export const scaleUp: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Pulse animation for buttons
export const pulse: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
    },
  },
};

// Card flip animation
export const cardFlip: Variants = {
  initial: { rotateY: 0 },
  flip: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

// Progress bar animation
export const progressBar = (value: number): Variants => {
  return {
    initial: { width: "0%" },
    animate: {
      width: `${value}%`,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
};

// Confetti animation for celebration
export const confetti: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: [0, 1, 0],
    y: [0, -100],
    transition: {
      duration: 1.5,
      times: [0, 0.5, 1],
      repeat: 3,
      repeatType: "loop",
    },
  },
};

// Shake animation for wrong answers
export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

// Bounce animation
export const bounce: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      times: [0, 0.5, 1],
    },
  },
};

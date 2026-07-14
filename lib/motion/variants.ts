/** Shared Agriveda motion tokens — keep durations 150–250ms, ease-out */
export const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;

export const MOTION = {
  fast: 0.15,
  normal: 0.22,
  slow: 0.35,
  stagger: 0.05,
} as const;

export const pageTransition = {
  initial: { opacity: 1, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: -4 },
  transition: { duration: MOTION.normal, ease: EASE_OUT },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.slow, ease: EASE_OUT },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * MOTION.stagger, duration: MOTION.slow, ease: EASE_OUT },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * MOTION.stagger, duration: MOTION.normal, ease: EASE_OUT },
  }),
};

export const tabPanel = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: MOTION.normal, ease: EASE_OUT },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: MOTION.stagger, delayChildren: 0.04 },
  },
  show: {
    transition: { staggerChildren: MOTION.stagger, delayChildren: 0.04 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.normal, ease: EASE_OUT },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.normal, ease: EASE_OUT },
  },
};

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: MOTION.fast },
};

export const modalPanel = {
  initial: { opacity: 0, scale: 0.96, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 16 },
  transition: { duration: MOTION.normal, ease: EASE_OUT },
};

export const cardHoverGlow =
  "transition-[box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--av-accent)]/50 hover:shadow-[var(--av-shadow-md)]";

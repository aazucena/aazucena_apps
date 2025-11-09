/**
 * Physics Utilities
 * Physics-based animation helpers
 */

/**
 * Damped spring animation
 */
export function dampedSpring(
  current: number,
  target: number,
  velocity: number,
  damping: number,
  stiffness: number,
  deltaTime: number
): { value: number; velocity: number } {
  const force = (target - current) * stiffness;
  const dampingForce = velocity * damping;
  const acceleration = force - dampingForce;

  const newVelocity = velocity + acceleration * deltaTime;
  const newValue = current + newVelocity * deltaTime;

  return {
    value: newValue,
    velocity: newVelocity
  };
}

/**
 * Ease-in-out function
 */
export function easeInOut(t: number): number {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
}

/**
 * Ease-in function
 */
export function easeIn(t: number): number {
  return t * t;
}

/**
 * Ease-out function
 */
export function easeOut(t: number): number {
  return t * (2 - t);
}

/**
 * Elastic ease-out
 */
export function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Bounce ease-out
 */
export function easeOutBounce(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

/**
 * Apply friction to velocity
 */
export function applyFriction(
  velocity: number,
  friction: number,
  deltaTime: number
): number {
  return velocity * Math.pow(1 - friction, deltaTime);
}

/**
 * Calculate velocity needed to reach target in time
 */
export function velocityToTarget(
  current: number,
  target: number,
  time: number
): number {
  return (target - current) / time;
}

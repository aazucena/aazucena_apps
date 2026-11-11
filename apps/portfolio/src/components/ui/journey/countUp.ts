import CountUpImport from "react-countup";

/**
 * react-countup ships CommonJS only. Vite 8's dependency optimizer (Astro 7)
 * can hand the default import back as the module namespace `{ default }`,
 * which React rejects as "Element type is invalid". Unwrap it once here.
 */
const CountUp =
  (CountUpImport as unknown as { default?: typeof CountUpImport }).default ??
  CountUpImport;

export default CountUp;

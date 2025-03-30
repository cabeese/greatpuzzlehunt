// A collection of helpers for interpreting environment variables as
// sane types (ints, bools, etc). Intended for runtime configuration
// flexibility.

export const asInt = (arg, default_value = -1) => {
  const as_int = parseInt(arg, 10);
  if (String(as_int) == arg) {
    return as_int;
  }
  return default_value;
}

export const asBool = (arg) => {
  // Could be unset (false)
  if (arg === "" || arg === null || arg === undefined) {
    return false;
  }

  // Could be 0/1 (or any number, really - this isn't thorough)
  const as_int = asInt(arg, -1);
  if (as_int != -1) {
    return !!as_int;
  }

  // Could be true/false
  const as_lc = String(arg).toLowerCase();
  if (as_lc === "true" || as_lc === "t") {
    return true;
  } else if (as_lc === "false" || as_lc === "f") {
    return false;
  }

  // Hrm, it's something suspicious!
  console.warn(`Failed to parse "${arg}" as a sane boolean`);
  return false;
}

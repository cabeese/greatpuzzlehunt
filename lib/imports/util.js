
/**
 * Shorten a potentially long name, e.g. for logging purposes
 */
export function getShortName(name) {
    if (name.length > 23) {
      name = `${name.substr(0,20)}...`
    }
    return name;
}


/**
 * Shorten a potentially long name, e.g. for logging purposes
 */
export function getShortName(name) {
    if (name.length > 23) {
      name = `${name.substr(0,20)}...`
    }
    return name;
}

export const gameModeOptions = [
    { key: 'INPERSON', value: 'INPERSON', text: 'In-Person (on WWU campus)' },
    { key: 'VIRTUAL', value: 'VIRTUAL', text: 'Virtually (e.g. over Zoom)' },
];
export const gameModeEnum = gameModeOptions.map(item => item.value);

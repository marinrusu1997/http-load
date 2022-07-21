const bytesToMegaBytes = bytes => bytes / (1024 ** 2);

const seconds = milliseconds => Math.floor(milliseconds / 1000);

const twoDecimalPlaces = num => Math.round((num + Number.EPSILON) * 100) / 100;

export { bytesToMegaBytes, seconds, twoDecimalPlaces };
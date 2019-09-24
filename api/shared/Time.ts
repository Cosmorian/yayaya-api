export default class Time {
  static getRoundedNow() {
    const now = new Date();
    const nowTs = now.valueOf();
    const nowMs = now.getUTCMilliseconds();
    const nowS = now.getUTCSeconds() * 1000;
    const roundedNow = nowTs - nowMs - nowS;
    return {
      roundedNow,
      nowS,
      nowTs,
    };
  }

  static getToday() {
    const now = new Date();
    const ts = now.valueOf();
    const timeOffset = 9;
    const roundedUTCToday = ts - (now.getUTCHours() * 60 * 60 * 1000) - (now.getUTCMinutes() * 60 * 1000) - (now.getUTCSeconds() * 1000) - now.getUTCMilliseconds();
    if (now.getUTCHours() + timeOffset > 23) {
      const day = 24 * 60 * 60 * 1000
      return roundedUTCToday + day + (timeOffset * 60 * 60 * 1000);
    } else {
      return roundedUTCToday + (timeOffset * 60 * 60 * 1000);
    }
  }
}

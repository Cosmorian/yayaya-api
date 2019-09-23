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
}

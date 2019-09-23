export default class Range {
  static create(n = 0) {
    return [...Array(n).keys()];
  }
}

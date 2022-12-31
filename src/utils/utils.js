class Utils {
  static isFunc = (f) => typeof f === "function";

  static getMapKey(map, value) {
    return [...map].find(([key, val]) => val == value);
  }

  static deleteInSet(set, val) {
    return [...set].filter((i) => i !== val);
  }
}

module.exports = Utils;

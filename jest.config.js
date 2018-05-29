module.exports = {
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
  ],
  roots: [
    "<rootDir>",
  ],
  testMatch: [
    "**/*.test.js",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
};

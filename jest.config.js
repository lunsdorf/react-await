module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.jest.json",
    },
  },
  moduleFileExtensions: [
    "js",
    "ts",
    "tsx",
  ],
  roots: [
    "<rootDir>",
  ],
  testMatch: [
    "**/*.test.js",
  ],
  transform: {
    ".(ts|tsx|js)": "ts-jest",
  },
  preset: "ts-jest/presets/js-with-ts",
}

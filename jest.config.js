module.exports = {
  globals: {
    "ts-jest": {
      skipBabel: true,
      tsConfigFile: "tsconfig.jest.json",
    },
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
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
};

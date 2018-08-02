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
    "**/*.test.ts",
    "**/*.test.tsx",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

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
  setupTestFrameworkScriptFile: "<rootDir>/jest.setup.js",
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  testMatch: [
    "**/*.test.ts",
    "**/*.test.tsx",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

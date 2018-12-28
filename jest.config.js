let mappedModule;
switch (process.env.TEST_ENV) {
  case "cjs":
    mappedModule = "<rootDir>/cjs/react-library.js";
    break;
  case "umd":
    mappedModule = "<rootDir>/umd/react-library.js";
    break;
  default:
    mappedModule = "<rootDir>/lib/react-library.js";
}

module.exports = {
  testRunner: "jest-circus/runner",
  restoreMocks: true,
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {
    "^react-library$": mappedModule
  },
  modulePaths: ["<rootDir>/node_modules"],
  testMatch: ["__tests__/**/*-test.js"],
  testURL: "http://localhost/"
};

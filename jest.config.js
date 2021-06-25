module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  globals: {
    'ts-jest': {
      isolatedModules: true, // this is safe because `npm run be` does it too
      diagnostics: false
    }
  }
}

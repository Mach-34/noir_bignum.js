module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1',  // Example of path alias mapping
    },
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Handle .ts and .tsx files with ts-jest
    },
    extensionsToTreatAsEsm: ['.ts'], // Optional, if you're using ECMAScript modules
  };
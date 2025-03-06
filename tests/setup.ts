// Add any global test setup here
// For example, you might want to:
// - Set up test environment variables
// - Configure test timeouts
// - Set up global mocks
// - Configure test reporters

// Example: Set a longer timeout for all tests
jest.setTimeout(10000);

// Example: Mock console.error to fail tests
const originalError = console.error;
console.error = (...args) => {
  originalError.call(console, ...args);
  throw new Error('Console error was called');
}; 
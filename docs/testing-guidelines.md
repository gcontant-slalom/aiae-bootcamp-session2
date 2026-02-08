# Testing Guidelines

## Overview
This document outlines the testing principles and requirements for the TODO application. A comprehensive testing strategy ensures code quality, prevents regressions, and maintains confidence in the application's functionality.

## Testing Philosophy

### Core Principles
1. **Test Coverage is Mandatory**: All new features must include appropriate tests before deployment
2. **Test Pyramid Approach**: Maintain a healthy balance of unit, integration, and end-to-end tests
3. **Maintainability First**: Write tests that are easy to understand, modify, and maintain
4. **Fast Feedback**: Tests should run quickly to enable rapid development cycles
5. **Meaningful Tests**: Write tests that verify behavior, not implementation details
6. **Test Documentation**: Tests should serve as living documentation of system behavior

## Testing Levels

### 1. Unit Tests

#### 1.1 Definition
Unit tests verify individual functions, methods, or components in isolation from external dependencies.

#### 1.2 Requirements
- **Coverage Target**: Minimum 80% code coverage for business logic
- **Scope**: Test single units of functionality
- **Dependencies**: Mock or stub external dependencies (APIs, databases, etc.)
- **Speed**: Each test should complete in milliseconds
- **Independence**: Tests must not depend on each other or execution order

#### 1.3 What to Test
- **Business Logic**: All functions that implement application rules
- **Utility Functions**: Helper functions and formatters
- **Component Logic**: React component behavior and state management
- **Input Validation**: Data validation and sanitization functions
- **Edge Cases**: Boundary conditions, null values, empty arrays, etc.
- **Error Handling**: How functions handle and propagate errors

#### 1.4 Testing Framework
- **Frontend**: Jest with React Testing Library
- **Backend**: Jest with Supertest for API endpoints

#### 1.5 Example Structure
```javascript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with required fields', () => {
      // Arrange
      const taskData = { title: 'Test Task' };
      
      // Act
      const result = createTask(taskData);
      
      // Assert
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Task');
      expect(result.createdAt).toBeDefined();
    });

    it('should throw error when title is missing', () => {
      // Arrange
      const taskData = {};
      
      // Act & Assert
      expect(() => createTask(taskData)).toThrow('Title is required');
    });
  });
});
```

#### 1.6 Best Practices
- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert (AAA) pattern
- Test one behavior per test case
- Avoid testing implementation details
- Keep setup code minimal and clear
- Use test data builders for complex objects

### 2. Integration Tests

#### 2.1 Definition
Integration tests verify that multiple components or modules work together correctly, including interactions with external systems.

#### 2.2 Requirements
- **Coverage Target**: All critical user flows must have integration tests
- **Scope**: Test interactions between components, API calls, database operations
- **Dependencies**: Use test databases or realistic mocks
- **Speed**: Should complete in seconds
- **Isolation**: Tests should clean up after themselves

#### 2.3 What to Test
- **API Endpoints**: Full request-response cycles
- **Database Operations**: CRUD operations with actual database
- **Service Interactions**: Multiple services working together
- **Authentication/Authorization**: User access control flows
- **Data Transformations**: Data flow through multiple layers
- **Error Scenarios**: How system handles failures across components

#### 2.4 Testing Framework
- **Frontend**: Jest with React Testing Library, MSW (Mock Service Worker) for API mocking
- **Backend**: Jest with Supertest, in-memory database for testing

#### 2.5 Example Structure
```javascript
describe('Task API Integration', () => {
  beforeEach(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Clean up test database
    await cleanupTestDatabase();
  });

  it('should create and retrieve a task', async () => {
    // Arrange
    const taskData = {
      title: 'Integration Test Task',
      description: 'Testing the full flow'
    };

    // Act - Create task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send(taskData)
      .expect(201);

    const taskId = createResponse.body.id;

    // Act - Retrieve task
    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .expect(200);

    // Assert
    expect(getResponse.body.title).toBe(taskData.title);
    expect(getResponse.body.description).toBe(taskData.description);
  });
});
```

#### 2.6 Best Practices
- Use separate test database instances
- Ensure proper setup and teardown
- Test realistic scenarios
- Verify side effects (database changes, external calls)
- Use factories for test data
- Test error conditions and edge cases

### 3. End-to-End (E2E) Tests

#### 3.1 Definition
E2E tests verify complete user flows through the application, simulating real user interactions with the full system.

#### 3.2 Requirements
- **Coverage Target**: All critical user journeys must have E2E tests
- **Scope**: Test complete user flows from UI to database
- **Dependencies**: Run against full application stack
- **Speed**: Can take minutes to complete
- **Stability**: Must be reliable and deterministic

#### 3.3 What to Test
- **Critical User Flows**: 
  - Creating a new task
  - Editing an existing task
  - Completing a task
  - Deleting a task
  - Filtering and sorting tasks
- **Multi-Step Workflows**: Complex interactions spanning multiple pages
- **Responsive Design**: Key flows on different screen sizes
- **Browser Compatibility**: Tests on major browsers (if applicable)
- **Error Recovery**: User-facing error messages and recovery paths

#### 3.4 Testing Framework
- **Recommended**: Playwright or Cypress
- **Alternative**: Selenium WebDriver

#### 3.5 Example Structure
```javascript
describe('Task Management Flow', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('should create, complete, and delete a task', async () => {
    // Create a task
    await page.fill('[data-testid="task-title-input"]', 'E2E Test Task');
    await page.click('[data-testid="add-task-button"]');
    
    // Verify task appears
    await expect(page.locator('text=E2E Test Task')).toBeVisible();
    
    // Mark task as complete
    await page.click('[data-testid="task-checkbox"]');
    await expect(page.locator('[data-testid="task-item"]')).toHaveClass(/completed/);
    
    // Delete task
    await page.click('[data-testid="delete-task-button"]');
    await page.click('[data-testid="confirm-delete-button"]');
    
    // Verify task is removed
    await expect(page.locator('text=E2E Test Task')).not.toBeVisible();
  });
});
```

#### 3.6 Best Practices
- Keep E2E tests focused on critical paths
- Use data-testid attributes for stable selectors
- Avoid testing through implementation details (CSS classes, IDs)
- Use page object model for maintainability
- Handle asynchronous operations properly
- Run E2E tests in CI/CD pipeline
- Keep tests independent and idempotent

## Test Organization

### File Structure
```
packages/
  frontend/
    src/
      components/
        TaskList.js
        TaskList.test.js          # Unit tests
      __tests__/
        integration/
          TaskListIntegration.test.js  # Integration tests
    e2e/
      task-management.spec.js     # E2E tests
  backend/
    src/
      services/
        taskService.js
        taskService.test.js       # Unit tests
      __tests__/
        integration/
          taskAPI.test.js         # Integration tests
```

### Naming Conventions
- **Unit Tests**: `[ComponentName].test.js` or `[functionName].test.js`
- **Integration Tests**: `[Feature]Integration.test.js`
- **E2E Tests**: `[userFlow].spec.js` or `[userFlow].e2e.js`

## Test Maintainability

### 1. Write Clear, Readable Tests
- Use descriptive test names that explain intent
- Avoid abbreviations and acronyms
- Structure tests consistently (AAA pattern)
- Add comments for complex setup or assertions

### 2. Reduce Duplication
- Extract common setup into `beforeEach` hooks
- Create test utilities and helpers
- Use factory functions for test data
- Share fixtures across related tests

### 3. Keep Tests Simple
- One logical assertion per test (when practical)
- Avoid complex logic in tests
- Minimize test setup requirements
- Use clear variable names

### 4. Make Tests Independent
- Each test should run in isolation
- No shared state between tests
- Proper cleanup in `afterEach` hooks
- Avoid coupling tests to execution order

### 5. Handle Async Operations Properly
- Use async/await for promises
- Wait for elements to appear before interacting
- Set appropriate timeouts
- Handle loading and error states

### 6. Use Test Data Builders
```javascript
// Test data builder example
const buildTask = (overrides = {}) => ({
  title: 'Default Task',
  description: 'Default description',
  completed: false,
  createdAt: new Date(),
  ...overrides
});

// Usage
const completedTask = buildTask({ completed: true });
const urgentTask = buildTask({ title: 'Urgent Task', dueDate: tomorrow });
```

### 7. Maintain Test Utilities
- Keep shared test utilities in dedicated files
- Document custom matchers and helpers
- Version control test fixtures
- Review and refactor test code regularly

## Test Coverage Requirements

### Coverage Targets
- **Unit Tests**: 80% minimum code coverage
- **Integration Tests**: 100% of API endpoints
- **E2E Tests**: 100% of critical user flows

### Coverage Reporting
- Generate coverage reports in CI/CD pipeline
- Track coverage trends over time
- Block merges that decrease coverage below thresholds
- Review uncovered code in pull requests

### What Not to Test
- Third-party library code
- Configuration files
- Trivial getters/setters
- Framework boilerplate
- Generated code

## Continuous Integration

### Pre-Commit
- Run unit tests locally before committing
- Use pre-commit hooks to enforce test execution
- Run linting and formatting checks

### Pull Request Process
1. All tests must pass before merge
2. Code coverage must meet minimum thresholds
3. Peer review of test quality
4. Verify new features include tests

### CI/CD Pipeline
```yaml
# Example CI workflow
test:
  unit-tests:
    - Run frontend unit tests
    - Run backend unit tests
    - Generate coverage reports
  
  integration-tests:
    - Setup test database
    - Run frontend integration tests
    - Run backend integration tests
    - Cleanup test environment
  
  e2e-tests:
    - Build application
    - Start application stack
    - Run E2E test suite
    - Capture screenshots on failure
    - Cleanup resources
```

## Test Data Management

### Test Data Principles
- Use realistic but anonymized data
- Create minimal data needed for tests
- Clean up test data after tests
- Avoid hardcoded IDs or dates
- Use factories for consistent test data

### Test Database
- Use separate test database
- Reset database state between tests
- Use transactions for isolation when possible
- Seed common test data in setup

## Debugging Failed Tests

### Best Practices
- Run tests in watch mode during development
- Use `test.only()` to focus on specific tests
- Add console.logs or debugger statements temporarily
- Check test output and error messages carefully
- Verify test data and state
- Use browser DevTools for E2E tests

### Common Issues
- **Flaky Tests**: Tests that pass/fail inconsistently
  - Solution: Properly handle async operations, avoid timeouts, ensure proper cleanup
- **Slow Tests**: Tests that take too long
  - Solution: Mock heavy dependencies, reduce test scope, parallelize execution
- **Brittle Tests**: Tests that break with minor changes
  - Solution: Test behavior not implementation, use stable selectors, avoid tight coupling

## Testing Best Practices Summary

### DO
✅ Write tests before or alongside feature implementation (TDD/BDD)
✅ Test behavior and outcomes, not implementation
✅ Keep tests simple, focused, and readable
✅ Use meaningful test descriptions
✅ Mock external dependencies in unit tests
✅ Test error conditions and edge cases
✅ Run tests frequently during development
✅ Review and refactor tests regularly
✅ Use consistent testing patterns

### DON'T
❌ Skip writing tests to save time
❌ Test implementation details
❌ Write tests that depend on each other
❌ Ignore failing tests
❌ Use production data in tests
❌ Write tests with complex logic
❌ Leave commented-out test code
❌ Duplicate test setup unnecessarily
❌ Ignore test maintenance

## Review and Updates

These testing guidelines should be reviewed quarterly and updated as the team learns and the application evolves. All team members are responsible for maintaining testing standards and improving test quality over time.

### Metrics to Track
- Test coverage percentage
- Test execution time
- Number of flaky tests
- Test maintenance effort
- Bug detection rate by test level

### Continuous Improvement
- Regular retrospectives on testing practices
- Share testing tips and techniques
- Update guidelines based on team feedback
- Invest in testing infrastructure and tools
- Celebrate good testing practices

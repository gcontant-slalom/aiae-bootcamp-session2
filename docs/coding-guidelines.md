# Coding Guidelines

## Overview
This document outlines the coding standards, style guidelines, and quality principles for the TODO application. Consistent code quality and style make the codebase more maintainable, readable, and easier to collaborate on. All contributors should follow these guidelines to ensure a cohesive and professional codebase.

## Philosophy

Our coding philosophy emphasizes:
- **Clarity over Cleverness**: Write code that is easy to understand rather than code that is clever but obscure
- **Consistency**: Follow established patterns throughout the codebase
- **Simplicity**: Prefer simple solutions over complex ones
- **Maintainability**: Write code that is easy to modify and extend
- **Quality**: Prioritize code quality over speed of delivery

## Code Formatting

### General Formatting Rules

#### Indentation and Whitespace
- Use **2 spaces** for indentation (no tabs)
- Maximum line length: **100 characters**
- Use empty lines to separate logical blocks of code
- Remove trailing whitespace from all lines
- End files with a single newline character

#### Naming Conventions

**Variables and Functions**
- Use **camelCase** for variables and functions
  ```javascript
  const userName = 'John';
  function getUserTasks() { }
  ```

**Constants**
- Use **UPPER_SNAKE_CASE** for true constants
  ```javascript
  const MAX_TASK_TITLE_LENGTH = 200;
  const API_BASE_URL = 'https://api.example.com';
  ```

**Classes and Components**
- Use **PascalCase** for classes and React components
  ```javascript
  class TaskManager { }
  function TaskList() { }
  ```

**Files and Directories**
- Use **kebab-case** for file names containing utilities or multiple exports
  ```
  task-helpers.js
  date-utils.js
  ```
- Use **PascalCase** for files containing a single React component
  ```
  TaskList.js
  AddTaskDialog.js
  ```

**Private Methods**
- Prefix private methods with underscore (convention, not enforced)
  ```javascript
  class TaskService {
    _validateTask(task) { }
  }
  ```

#### Braces and Brackets
- Always use braces for control structures, even single-line statements
  ```javascript
  // Good
  if (condition) {
    doSomething();
  }
  
  // Bad
  if (condition) doSomething();
  ```

- Place opening braces on the same line (K&R style)
  ```javascript
  function myFunction() {
    // code here
  }
  ```

#### Quotes
- Use **single quotes** for strings by default
- Use **backticks** for template literals
  ```javascript
  const message = 'Hello World';
  const greeting = `Hello ${name}`;
  ```

#### Semicolons
- Always use semicolons at the end of statements
- Do not rely on automatic semicolon insertion (ASI)

### Import Organization

Organize imports in the following order, with blank lines between each group:

1. **External/Third-party libraries** (React, Material-UI, etc.)
2. **Internal utilities and helpers**
3. **Components**
4. **Services and APIs**
5. **Constants and configuration**
6. **Types and interfaces** (TypeScript)
7. **Styles and assets**

```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { Button, TextField, Card } from '@mui/material';
import axios from 'axios';

// Internal utilities
import { formatDate, sortByDate } from '../utils/date-helpers';
import { validateTask } from '../utils/validation';

// Components
import TaskList from './TaskList';
import AddTaskDialog from './AddTaskDialog';

// Services
import { taskService } from '../services/task-service';

// Constants
import { API_ENDPOINTS } from '../config/constants';

// Styles
import './App.css';
```

**Import Guidelines:**
- Sort imports alphabetically within each group
- Use named imports when possible for tree-shaking
- Avoid wildcard imports (`import * as`)
- Use absolute paths for shared utilities, relative paths for local files
- Destructure default exports when importing multiple items from the same module

## Linting and Code Quality Tools

### ESLint Configuration

All code must pass ESLint validation before being committed. Our ESLint configuration enforces:

- **Airbnb JavaScript Style Guide** as the base
- **React best practices** and hooks rules
- **Accessibility** requirements (jsx-a11y plugin)
- **Import/export** validation

**Running ESLint:**
```bash
# Lint all files
npm run lint

# Lint with auto-fix
npm run lint:fix

# Lint specific file
npx eslint src/components/TaskList.js
```

### Prettier Configuration

Prettier handles automatic code formatting. Configuration:
- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Semicolons**: Required
- **Single Quotes**: Yes
- **Trailing Commas**: ES5 (objects, arrays)
- **Bracket Spacing**: Yes
- **Arrow Parens**: Always

**Running Prettier:**
```bash
# Format all files
npm run format

# Check formatting without modifying files
npm run format:check
```

### Pre-commit Hooks

We use **Husky** and **lint-staged** to enforce quality checks before commits:
- Run ESLint on staged JavaScript files
- Run Prettier on all staged files
- Run unit tests related to changed files
- Validate commit message format

## Best Practices and Principles

### DRY (Don't Repeat Yourself)

**Principle**: Every piece of knowledge should have a single, unambiguous representation in the system.

**Application:**
- Extract repeated code into reusable functions or components
- Use constants for values that appear multiple times
- Create utility functions for common operations
- Use composition to share behavior between components

**Example:**
```javascript
// Bad - Repeated logic
function formatDueDate(task) {
  if (task.dueDate) {
    return new Date(task.dueDate).toLocaleDateString();
  }
  return 'No due date';
}

function formatCreatedDate(task) {
  if (task.createdAt) {
    return new Date(task.createdAt).toLocaleDateString();
  }
  return 'Unknown';
}

// Good - Extracted common logic
function formatDate(date, defaultValue = 'No date') {
  return date ? new Date(date).toLocaleDateString() : defaultValue;
}

function formatDueDate(task) {
  return formatDate(task.dueDate, 'No due date');
}

function formatCreatedDate(task) {
  return formatDate(task.createdAt, 'Unknown');
}
```

### SOLID Principles

#### Single Responsibility Principle (SRP)
Each module, class, or function should have one, and only one, reason to change.

```javascript
// Bad - Multiple responsibilities
class TaskManager {
  saveTask(task) { }
  validateTask(task) { }
  renderTask(task) { }
  sendEmail(task) { }
}

// Good - Single responsibility
class TaskRepository {
  saveTask(task) { }
  getTask(id) { }
}

class TaskValidator {
  validate(task) { }
}

class TaskRenderer {
  render(task) { }
}
```

#### Open/Closed Principle (OCP)
Software entities should be open for extension but closed for modification.

```javascript
// Good - Extensible through composition
class TaskFilter {
  filter(tasks, criteria) {
    return criteria.apply(tasks);
  }
}

class CompletedTasksCriteria {
  apply(tasks) {
    return tasks.filter(task => task.completed);
  }
}

class OverdueTasksCriteria {
  apply(tasks) {
    return tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date()
    );
  }
}
```

#### Liskov Substitution Principle (LSP)
Objects should be replaceable with instances of their subtypes without altering program correctness.

```javascript
// Good - Subtypes can replace base type
class TaskSorter {
  sort(tasks) {
    throw new Error('Must implement sort method');
  }
}

class DateSorter extends TaskSorter {
  sort(tasks) {
    return tasks.sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );
  }
}

class TitleSorter extends TaskSorter {
  sort(tasks) {
    return tasks.sort((a, b) => 
      a.title.localeCompare(b.title)
    );
  }
}
```

#### Interface Segregation Principle (ISP)
Clients should not be forced to depend on interfaces they don't use.

```javascript
// Bad - Fat interface
interface TaskOperations {
  create();
  read();
  update();
  delete();
  export();
  import();
  archive();
}

// Good - Segregated interfaces
interface TaskCRUD {
  create();
  read();
  update();
  delete();
}

interface TaskExporter {
  export();
}

interface TaskImporter {
  import();
}
```

#### Dependency Inversion Principle (DIP)
Depend on abstractions, not concretions.

```javascript
// Bad - Direct dependency on concrete implementation
class TaskList {
  constructor() {
    this.api = new TaskAPI(); // Concrete dependency
  }
}

// Good - Dependency injection
class TaskList {
  constructor(taskService) {
    this.taskService = taskService; // Abstract dependency
  }
}

const taskService = new TaskService();
const taskList = new TaskList(taskService);
```

### KISS (Keep It Simple, Stupid)

**Principle**: Simplicity should be a key goal in design, and unnecessary complexity should be avoided.

**Guidelines:**
- Prefer simple solutions over complex ones
- Break complex problems into smaller, manageable pieces
- Avoid premature optimization
- Use clear and descriptive names instead of comments when possible
- Favor composition over inheritance

**Example:**
```javascript
// Bad - Overly complex
function getTaskStatus(task) {
  return task.completed ? 'complete' : 
         task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' :
         task.dueDate && new Date(task.dueDate) - new Date() < 86400000 ? 'due-soon' :
         'pending';
}

// Good - Simple and clear
function getTaskStatus(task) {
  if (task.completed) {
    return 'complete';
  }
  
  if (!task.dueDate) {
    return 'pending';
  }
  
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const oneDayInMs = 86400000;
  
  if (dueDate < now) {
    return 'overdue';
  }
  
  if (dueDate - now < oneDayInMs) {
    return 'due-soon';
  }
  
  return 'pending';
}
```

### YAGNI (You Aren't Gonna Need It)

**Principle**: Don't add functionality until it's necessary.

**Guidelines:**
- Implement features only when they're required
- Avoid building "just in case" functionality
- Focus on current requirements, not hypothetical future needs
- Refactor when new requirements emerge

### Separation of Concerns

**Principle**: Separate different aspects of the application into distinct sections.

**Application:**
- Keep business logic separate from UI components
- Separate data fetching from data presentation
- Keep API calls in dedicated service files
- Maintain clear boundaries between layers

**Example:**
```javascript
// Good - Separated concerns

// Service layer (task-service.js)
export const taskService = {
  async fetchTasks() {
    const response = await fetch('/api/tasks');
    return response.json();
  }
};

// Business logic layer (task-utils.js)
export function sortTasksByDueDate(tasks) {
  return [...tasks].sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );
}

// Presentation layer (TaskList.js)
function TaskList() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    taskService.fetchTasks().then(setTasks);
  }, []);
  
  const sortedTasks = sortTasksByDueDate(tasks);
  
  return <div>{/* render tasks */}</div>;
}
```

## Code Documentation

### Comments

**When to Comment:**
- Complex algorithms or business logic
- Non-obvious workarounds or hacks
- Public APIs and exported functions
- Regular expressions
- Important decisions and trade-offs

**When NOT to Comment:**
- Obvious code (let the code speak for itself)
- Outdated or incorrect information
- Code that should be rewritten for clarity

**Comment Style:**
```javascript
// Single-line comment for brief explanations

/**
 * Multi-line comment for detailed explanations
 * Use JSDoc format for functions and classes
 */

/**
 * Creates a new task with the provided data
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - The task title (required)
 * @param {string} taskData.description - The task description (optional)
 * @returns {Promise<Task>} The created task
 * @throws {ValidationError} If task data is invalid
 */
async function createTask(taskData) {
  // Implementation
}
```

### Self-Documenting Code

Write code that explains itself:
```javascript
// Bad - Needs comments
// Check if task is overdue
if (t.dd && new Date(t.dd) < new Date()) { }

// Good - Self-explanatory
function isTaskOverdue(task) {
  if (!task.dueDate) {
    return false;
  }
  return new Date(task.dueDate) < new Date();
}

if (isTaskOverdue(task)) { }
```

## Error Handling

### Consistent Error Handling

**Guidelines:**
- Always handle errors, never silently fail
- Use try-catch for async operations
- Provide meaningful error messages
- Log errors appropriately
- Return or throw errors, don't do both

**Example:**
```javascript
// Good error handling
async function deleteTask(taskId) {
  try {
    await taskService.delete(taskId);
    showSuccessMessage('Task deleted successfully');
  } catch (error) {
    console.error('Failed to delete task:', error);
    showErrorMessage('Unable to delete task. Please try again.');
    throw error; // Re-throw if caller needs to handle it
  }
}
```

### Error Messages

- Be specific about what went wrong
- Provide actionable information when possible
- Use user-friendly language in UI messages
- Include technical details in logs

## Performance Considerations

### General Guidelines

- Avoid premature optimization
- Profile before optimizing
- Optimize for readability first, performance second
- Use appropriate data structures
- Minimize DOM manipulations
- Debounce/throttle expensive operations
- Use React.memo, useMemo, useCallback appropriately (but not excessively)

### Example:
```javascript
// Good - Debounced search
import { debounce } from 'lodash';

const handleSearch = debounce((searchTerm) => {
  searchTasks(searchTerm);
}, 300);
```

## React-Specific Guidelines

### Component Structure

```javascript
// Good component structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function TaskItem({ task, onUpdate, onDelete }) {
  // Hooks
  const [isEditing, setIsEditing] = useState(false);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [task]);
  
  // Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    onUpdate(task);
    setIsEditing(false);
  };
  
  // Render helpers
  const renderEditMode = () => {
    // Edit mode JSX
  };
  
  const renderViewMode = () => {
    // View mode JSX
  };
  
  // Main render
  return (
    <div>
      {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
}

// PropTypes
TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskItem;
```

### Hooks Guidelines

- Follow the Rules of Hooks (only call at top level, only in React functions)
- Extract complex logic into custom hooks
- Name custom hooks with "use" prefix
- Keep hooks focused and single-purpose

### State Management

- Keep state as local as possible
- Lift state up only when necessary
- Use Context API for truly global state
- Consider state management libraries (Redux, Zustand) for complex state

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] Code follows all formatting guidelines
- [ ] No linting errors or warnings
- [ ] All imports are organized correctly
- [ ] Functions and variables have meaningful names
- [ ] Complex logic is documented with comments
- [ ] No console.logs or debugging code left in
- [ ] Error handling is appropriate
- [ ] Tests are included and passing
- [ ] No duplicate code (DRY principle applied)
- [ ] Code follows SOLID principles where applicable
- [ ] Components are properly structured
- [ ] PropTypes or TypeScript types are defined
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met

## Resources

### Style Guides
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

### Tools
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)

### Further Reading
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) by Robert C. Martin
- [The Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
- [Refactoring](https://martinfowler.com/books/refactoring.html) by Martin Fowler

## Continuous Improvement

These guidelines are living documents and should evolve with the team's needs and industry best practices. All team members are encouraged to:
- Suggest improvements to these guidelines
- Share new patterns and practices discovered
- Participate in regular code quality discussions
- Stay updated with JavaScript and React ecosystem changes

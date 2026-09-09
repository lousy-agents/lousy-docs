---
applyTo: "{src,tests}/**/*.{test,spec}.{ts,tsx}"
---

# Testing Conventions

Tests are executable documentation. A reader who cannot tell what behavior broke from the failure output alone is reading a test that documents nothing, which is the standard every rule below serves.

Run `npm test` after modifying or creating tests. A test suite you did not run is not evidence.

## Naming

The house convention nests three levels, and the failure report reads as a sentence when all three are present:

- Outer `describe` names the unit under test — the component, hook, or module (`describe("SiteFooter")`).
- Nested `describe` names the context as `given <condition>` (`describe("given the drawer is closed")`).
- `it` states the expected behavior as `should <behavior>` (`it("should render footer navigation links")`).

Match this convention rather than inventing a variant; it is what the existing suite uses, so a deviation reads as a signal that something different is happening.

## Test File Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('ComponentName', () => {
  describe('given [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      const input = 'test-value';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected-value');
    });
  });
});
```

## Worked Example: HTTP, Fixtures, and Error Paths

This example shows the whole convention together — MSW for transport, Chance.js for fixtures, and one `describe` per context including the unhappy paths.

```typescript
import Chance from 'chance';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { beforeAll, afterAll, afterEach, describe, it, expect } from 'vitest';
import { fetchUserById } from './user-service';

const chance = new Chance();
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ✅ Good - describes behavior, reads like documentation, uses generated fixtures
describe('User retrieval', () => {
  describe('given a valid user ID', () => {
    it('should return the user details from the API', async () => {
      // Arrange
      const userId = chance.guid();
      const expectedUser = { id: userId, name: chance.name() };
      server.use(
        http.get(`/api/users/${userId}`, () => {
          return HttpResponse.json(expectedUser);
        })
      );

      // Act
      const result = await fetchUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
    });
  });

  describe('given an empty user ID', () => {
    it('should reject with a validation error', async () => {
      // Arrange - no server setup needed, validation happens before fetch

      // Act & Assert
      await expect(fetchUserById('')).rejects.toThrow('User ID required');
    });
  });

  describe('given a non-existent user ID', () => {
    it('should reject with an error containing the status code', async () => {
      // Arrange
      const userId = chance.guid();
      server.use(
        http.get(`/api/users/${userId}`, () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      // Act & Assert
      await expect(fetchUserById(userId)).rejects.toThrow(
        'Failed to fetch user: 404'
      );
    });
  });

  describe('given an invalid response shape', () => {
    it('should reject with a validation error', async () => {
      // Arrange
      const userId = chance.guid();
      server.use(
        http.get(`/api/users/${userId}`, () => {
          return HttpResponse.json({ invalid: 'data' });
        })
      );

      // Act & Assert
      await expect(fetchUserById(userId)).rejects.toThrow();
    });
  });
});

// ❌ Bad - implementation-focused, hardcoded values, duplicated test data
describe('fetchUserById', () => {
  it('works', async () => {
    const user = { id: '123', name: 'Alice' };
    server.use(
      http.get('/api/users/123', () => HttpResponse.json(user))
    );
    const result = await fetchUserById('123'); // duplicated '123' across arrange/act/assert
    expect(result).toEqual(user);
  });
});
```

## Test Data

- Use Chance.js to generate test data when the actual input values are not important, so that a test cannot pass by accident on one hardcoded value.
- Choose Chance.js generators that produce readable assertion failure messages; a failure showing an unreadable blob costs more to diagnose than the randomization saved.
- Use simple strings or numbers, avoiding elaborate Chance.js configurations.
- Extract every fixture value to a variable. Duplicating a literal across arrange and assert means the assertion can agree with the setup while both disagree with the code.

## Test Design Rules

1. Follow the Arrange-Act-Assert pattern for all tests.
2. Use spec-style tests with `describe` and `it` blocks.
3. Focus on behavior, not implementation details, so that a refactor which preserves behavior does not break the suite.
4. Use `msw` to mock HTTP APIs. Do not mock `fetch` or `axios` directly: a transport-level mock asserts on the call rather than the contract, so it keeps passing after the request shape changes.
5. Reset MSW handlers between tests. A handler left registered makes the next test pass for the wrong reason.
6. Avoid mocking third-party dependencies where a real instance will do.
7. Tests shall be isolated, with no shared state between tests, because shared state makes a failure depend on execution order and therefore irreproducible.
8. Tests shall be deterministic — the same result every run.
9. Tests shall run identically locally and in CI, so that a green local run predicts a green CI run.
10. Never use partial mocks. A partially mocked module passes through some real behavior and stubs the rest, so the test documents a configuration that never ships.
11. Test all conditional paths with meaningful assertions.
12. Test unhappy paths and edge cases, not just happy paths.
13. Every assertion should explain the expected behavior.
14. Write tests that would fail if the production code regressed. A test that passes against a deliberately broken implementation is measuring nothing.
15. Never modify a test to make it pass without understanding the root cause. A test changed to match broken behavior removes the signal that something regressed.
16. **Never export a function, method, or variable from production code solely for testing.** A test-only export becomes part of the public API and outlives the test that needed it. Inject the dependency through a parameter instead.
17. **Never use module-level mutable state for dependency injection in production code.** It leaks between tests in the same file and makes failures order-dependent.
18. **Event listeners added during tests shall be removed in `try/finally` or `afterEach`** — never place cleanup after assertions, because a failed assertion skips it and leaks the listener into subsequent tests.

## Interactive UI Testing

Interactive components (dialogs, overlays, drawers, popovers, keyboard shortcuts) require **e2e tests** in addition to unit tests. Unit tests verify event dispatch and rendering; only a real browser shows whether focus actually moved, which is the part users depend on and the part that silently breaks.

### Required e2e coverage for overlay/dialog components:
- Open via all trigger methods (button click, keyboard shortcut)
- Close via all dismiss methods (close button, Escape, backdrop click)
- Focus is trapped within the dialog while open
- Focus returns to the previously focused element on close
- Keyboard navigation works correctly within the component

## Dependency Injection for Testing

When you need to inject dependencies for testing:

- **Do** use constructor parameters, function parameters, or framework-provided mechanisms (e.g., context objects).
- **Do** pass test doubles through the existing public API of the code under test.
- **Do not** export special test-only functions like `_setTestDependencies()` or `_resetTestDependencies()`.
- **Do not** modify module-level state from tests.

### Good Example (Dependency Injection via Parameters)

```typescript
// Production code
export function createUserService(repository: UserRepository) {
  return {
    async getUser(id: string) {
      return repository.findById(id);
    }
  };
}

// Test code
it("should return user when found", async () => {
  const mockRepository = {
    findById: vi.fn().mockResolvedValue({ id: "1", name: "John" })
  };
  const service = createUserService(mockRepository);

  const result = await service.getUser("1");

  expect(result).toEqual({ id: "1", name: "John" });
});
```

### Bad Example (Test-Only Exports)

```typescript
// ❌ BAD: Production code
let _repositoryOverride: any;

export function _setTestDependencies(deps: any) {
  _repositoryOverride = deps.repository;
}

export function getUser(id: string) {
  const repository = _repositoryOverride || defaultRepository;
  return repository.findById(id);
}

// ❌ BAD: Test code
import { _setTestDependencies, getUser } from "./user-service";

beforeEach(() => {
  _setTestDependencies({ repository: mockRepository });
});
```

## Dependencies

Install new test dependencies using `npm install <package>@<exact-version>`, because a range lets the installed tree drift without a diff.

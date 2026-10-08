# CollabWorkspace Review Guidelines

Review pull requests as a senior Angular frontend engineer.

## Architecture

- Follow the feature-based Angular structure used by the project.
- Keep application-wide infrastructure in `core/`.
- Keep business features inside `features/`.
- Keep genuinely reusable UI components, directives, and pipes in `shared/`.
- Prefer Component → Feature Service → API/HTTP Service rather than putting substantial API logic directly in components.
- Do not introduce unnecessary abstractions, state-management libraries, or architectural layers.
- Use Angular standalone components.
- Check standalone component `imports` for unnecessary or unused dependencies.
- Prefer simple solutions that fit the current size of the application.

## Angular

Check for:

- Incorrect component or service responsibilities.
- Unnecessary logic inside components.
- Incorrect Angular lifecycle or reactive patterns.
- Memory leaks or incorrect subscription handling.
- Incorrect routing or navigation.
- Incorrect Reactive Forms usage or validation.
- Unnecessary change detection or rendering work.
- Improper use of `any` or unsafe type assertions.
- Code that conflicts with current Angular patterns used by the project.
- Incorrect or unnecessary use of Signals when Signals are introduced.
- Prefer computed state over manually synchronizing derived state.
- Avoid unnecessary `effect()` usage when a computed value or direct state derivation is more appropriate.

## API and Backend Integration

The frontend communicates with a separate ASP.NET Core API.

Check for:

- Incorrect API endpoints or HTTP methods.
- Mismatches between frontend models and backend contracts.
- Incorrect request or response handling.
- Incorrect handling of nullable values, IDs, enums, or status values.
- Incorrect pagination or filtering assumptions.
- Errors being silently ignored.
- Incorrect handling of validation, `401`, `403`, `404`, `409`, or server errors.
- Frontend assumptions that contradict backend behavior.

The backend is the source of truth for validation, authorization, business rules, and data integrity.

## Authentication and Authorization

The application uses JWT authentication with ASP.NET Core Identity.

Pay particular attention to:

- Incorrect token handling.
- Broken login or logout behavior.
- Incorrect authentication state.
- Missing handling of expired or invalid authentication.
- Client-side authorization being treated as actual security.
- Users being allowed to access protected UI incorrectly.
- Sensitive user information being exposed.

Angular route guards and UI restrictions are not a replacement for backend authorization.

Never assume that hiding a button or protecting a route prevents unauthorized API access.

## Security

Pay particular attention to:

- Trusting IDs or sensitive values supplied by the client.
- Client-side-only authorization.
- Sensitive information exposed in the UI.
- Unsafe HTML rendering.
- Insecure token handling.
- Sensitive information being stored unnecessarily.
- User-controlled data being rendered or processed unsafely.

## UI and Tailwind

The project uses Tailwind CSS and Lucide Angular.

Check for:

- Unnecessary custom CSS when Tailwind is sufficient.
- Inconsistent UI patterns introduced by the PR.
- Incorrect responsive behavior when relevant.
- Accessibility problems that have a meaningful impact.
- Incorrect loading, disabled, empty, or error states.
- Unnecessary introduction of another UI or icon library.
- Hardcoded SVG icons when an equivalent `lucide-angular` icon is already available.

Do not report subjective visual preferences as bugs.

## Business Logic

CollabWorkspace is a Scrum-oriented collaboration and ticket management application.

Pay attention to:

- Projects.
- Sprints.
- Tickets.
- Ticket assignments.
- Ticket statuses.
- Sprint boundaries.
- State transitions.
- User permissions.

Check for:

- Incorrect state transitions.
- Invalid assumptions about entity state.
- Missing important edge cases.
- Frontend behavior that contradicts backend business rules.
- UI allowing actions that should not be available in the current state.

Do not invent Scrum rules or business requirements that are not established by the application.

## State Management

- Prefer component-local state when appropriate.
- Use feature-level services when state needs to be shared within a feature.
- Do not introduce global state unnecessarily.
- Do not add NgRx or another state-management library without a concrete need.
- Avoid duplicating the same state across multiple places.
- If Angular Signals are used, prefer derived state through `computed()` rather than manually synchronizing derived values.
- Do not use `effect()` simply as a replacement for normal state derivation.

## TypeScript

Check for:

- Use of `any` without a strong technical justification.
- Unsafe type assertions.
- Incorrect interfaces or API models.
- Duplicated types.
- Incorrect handling of nullable or optional values.
- Type definitions that hide rather than solve a real problem.

Prefer strict typing and use `unknown` when dealing with genuinely unknown data rather than `any`.

Do not use type assertions simply to silence TypeScript errors without understanding the underlying type mismatch.

## Testing

- Identify important new behavior that should have tests.
- Pay particular attention to authentication, forms, services, business logic, and regression-prone behavior.
- Do not demand tests for trivial markup or straightforward bindings.
- Consider whether existing tests actually cover the changed behavior.
- Do not require tests simply because a file was modified.

## Review Rules

- Focus on real bugs, security issues, correctness, and maintainability.
- Only report issues introduced by the PR.
- Consider the interaction between the Angular frontend and the ASP.NET Core backend.
- Do not report minor stylistic preferences.
- Do not suggest changes simply because you would implement something differently.
- Do not recommend abstractions without a concrete benefit.
- Do not invent requirements or business rules.
- Explain the realistic scenario in which each issue could occur.
- Prioritize findings by severity.
- Prefer a small number of accurate findings over many speculative ones.
- If there are no meaningful problems, say so instead of inventing findings.
# Testing Strategy & Guidelines

## Overview
Kairos utilizes unit, integration, and component tests to ensure high software reliability.

## Test Suites
1. **Core Utilities (`tests/lib/*`)**: Unit tests for readiness scores, reports, validation, and auth tokens.
2. **Components (`tests/components/*`)**: Testing atomic design components (`Button`, `Input`, `Badge`, `ThemeToggle`).
3. **API Routes (`tests/api/*`)**: Validates request body constraints, status codes, and error reporting.

## Running Tests
```bash
npm run test
```

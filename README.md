# Playwright API Automation Framework

A learning and interview-preparation API automation framework using
**Playwright Test**, **TypeScript**, **Zod**, **dotenv**, and the public
[Restful Booker demo API](https://restful-booker.herokuapp.com/).

> **Note:** Restful Booker is a shared public demo service. It can
> reset, be unavailable, or change behavior. These tests create and
> delete demo bookings. Never use production credentials or sensitive
> data.

## 1. Technology stack

-   Playwright Test: test runner, API requests, assertions, traces, and
    HTML reporting.
-   TypeScript: request/response typing.
-   Zod: runtime response-schema validation.
-   dotenv: environment configuration.
-   Restful Booker: sample API under test.

## 2. Folder structure

``` text
playwright-api-framework/
├── api/
│   ├── auth.api.ts                 # Authentication endpoint wrapper
│   └── booking.api.ts              # Reusable booking endpoint methods
├── fixtures/
│   └── api.fixtures.ts             # Shared AuthApi and BookingApi fixtures
├── schemas/
│   └── booking.schema.ts           # Zod response schemas
├── test-data/
│   └── booking.data.ts             # Reusable booking payload builders
├── tests/
│   ├── auth.spec.ts                # Valid/invalid authentication
│   ├── booking-crud.spec.ts        # Create/read/update/patch/delete workflow
│   ├── booking-filter.spec.ts      # Filter bookings by name
│   └── booking-negative.spec.ts    # Nonexistent ID and invalid-token cases
├── types/
│   └── booking.types.ts            # TypeScript request/response types
├── .env                            # Local settings; never commit
├── .env.example                    # Example environment-variable template
├── .gitignore                      # Excludes secrets and generated artifacts
├── package.json                    # Dependencies and npm scripts
├── package-lock.json               # Generated locked dependency versions
├── playwright.config.ts            # Test runner, URL, timeouts, reporters, traces
├── tsconfig.json                   # TypeScript compiler settings
└── README.md                       # Setup, architecture, scenarios, commands
```

### Layer responsibilities

  -----------------------------------------------------------------------
  Folder/file                         Purpose
  ----------------------------------- -----------------------------------
  `api/`                              Encapsulates HTTP calls so endpoint
                                      logic is not duplicated in tests.

  `fixtures/`                         Supplies reusable API clients
                                      through Playwright fixtures.

  `types/`                            Defines compile-time data
                                      contracts.

  `test-data/`                        Builds reusable request payloads.

  `schemas/`                          Checks response shape and field
                                      types at runtime with Zod.

  `tests/`                            Contains test scenarios and
                                      assertions.

  `playwright.config.ts`              Configures test discovery,
                                      timeouts, retries, reporting, and
                                      traces.

  `.env`                              Local base URL and demo
                                      credentials. Keep private.
  -----------------------------------------------------------------------

## 3. Prerequisites

Install Node.js (LTS recommended), npm, and optionally Visual Studio
Code. Verify installation:

``` powershell
node --version
npm --version
```

## 4. Setup on Windows / VS Code

``` powershell
cd "$HOME\Desktop"
mkdir playwright-api-framework
cd playwright-api-framework
code .
npm init -y
npm install --save-dev @playwright/test typescript @types/node
npm install dotenv zod
```

Create the folders/files listed above, then add the framework code to
each corresponding file.

Create `.env` in the project root:

``` dotenv
BASE_URL=https://restful-booker.herokuapp.com
API_USERNAME=admin
API_PASSWORD=password123
```

These are sample credentials for the public demo API, not production
credentials. Create `.env.example` with the same variable names and safe
sample values. Commit `.env.example`, but **never commit `.env`**.

Ensure `.gitignore` contains:

``` gitignore
node_modules/
dist/
.env
playwright-report/
test-results/
```

## 5. npm scripts

Run these commands from the project root to add scripts:

``` powershell
npm pkg set "scripts.test=playwright test"
npm pkg set "scripts.test:api=playwright test tests"
npm pkg set "scripts.test:auth=playwright test tests/auth.spec.ts"
npm pkg set "scripts.test:crud=playwright test tests/booking-crud.spec.ts"
npm pkg set "scripts.test:negative=playwright test tests/booking-negative.spec.ts"
npm pkg set "scripts.test:filter=playwright test tests/booking-filter.spec.ts"
npm pkg set "scripts.report=playwright show-report"
npm pkg set "scripts.typecheck=tsc --noEmit"
```

## 6. Test scenarios

### A. Authentication --- `tests/auth.spec.ts`

  -----------------------------------------------------------------------
  ID                      Scenario                Expected result
  ----------------------- ----------------------- -----------------------
  AUTH-01                 Send valid demo         HTTP 200 and a
                          credentials to          non-empty token.
                          `POST /auth`.           

  AUTH-02                 Send invalid            No token; response
                          credentials to          reason such as
                          `POST /auth`.           `Bad credentials`.
  -----------------------------------------------------------------------

**Interview topics:** positive/negative testing, token validation, and
API-specific status-code behavior.

Restful Booker may return HTTP 200 for invalid credentials while
including a failure reason in the response body. Assert the target API's
actual contract rather than assuming every API returns 401.

### B. Booking CRUD lifecycle --- `tests/booking-crud.spec.ts`

  ------------------------------------------------------------------------------
  ID                Action            Endpoint                 Main validation
  ----------------- ----------------- ------------------------ -----------------
  CRUD-01           Create booking    `POST /booking`          Successful status
                                                               and numeric
                                                               `bookingid`.

  CRUD-02           Read created      `GET /booking/{id}`      Successful status
                    booking                                    and valid
                                                               response schema.

  CRUD-03           Validate created  `GET /booking/{id}`      First name and
                    data                                       generated last
                                                               name match.

  CRUD-04           Fully update      `PUT /booking/{id}`      Updated first
                    booking                                    name and price
                                                               are returned.

  CRUD-05           Partially update  `PATCH /booking/{id}`    First name
                    booking                                    changes and other
                                                               fields remain as
                                                               expected.

  CRUD-06           Delete booking    `DELETE /booking/{id}`   A success status
                                                               accepted by the
                                                               demo API.

  CRUD-07           Verify deletion   `GET /booking/{id}`      HTTP 404 after
                                                               deletion.
  ------------------------------------------------------------------------------

The workflow obtains an auth token for protected operations and attempts
cleanup in a `finally` block if the test fails before deletion.

### C. Negative scenarios --- `tests/booking-negative.spec.ts`

  -----------------------------------------------------------------------
  ID                      Scenario                Expected result
  ----------------------- ----------------------- -----------------------
  NEG-01                  Read booking ID `0`     HTTP 404.
                          (nonexistent).          

  NEG-02                  Update an existing      HTTP 403 for the demo
                          booking with an invalid API.
                          token.                  
  -----------------------------------------------------------------------

The invalid-token test creates a temporary booking and deletes it
afterward using a valid token.

### D. Filter/search --- `tests/booking-filter.spec.ts`

  -----------------------------------------------------------------------
  ID                      Scenario                Expected result
  ----------------------- ----------------------- -----------------------
  FIL-01                  Create a booking, then  HTTP 200 and results
                          search by first and     contain the created
                          generated last name.    booking ID.

  -----------------------------------------------------------------------

The generated last name reduces collisions with shared demo data.

## 7. Run tests

``` bash
# TypeScript type check
npm run typecheck

# Run each test group
npm run test:auth
npm run test:crud
npm run test:negative
npm run test:filter

# Run all API tests
npm run test:api

# Open the HTML report after a test run
npm run report
```

### GitHub Actions

The workflow in `.github/workflows/ci.yml` runs the TypeScript type check and
API tests on every push and pull request, and can also be started manually from
the Actions tab. It uses the public Restful Booker demo API and its documented
sample credentials; do not replace them with production credentials.

Run one file directly:

``` bash
npx playwright test tests/auth.spec.ts
```

## 8. Reports and debugging

-   The `list` reporter displays progress/results in the terminal.
-   The HTML report is written to `playwright-report/`.
-   `trace: "retain-on-failure"` retains traces for failed tests.
-   Test artifacts are written under `test-results/`; do not commit
    generated artifacts.

If a test fails, check API availability, `.env` variable names, current
response status/body, and whether the shared demo service reset its
data. Distinguish TypeScript compilation errors from runtime/API
assertion failures.

## 9. Framework design practices demonstrated

-   API client abstraction: HTTP calls live in reusable classes.
-   Playwright fixtures: client objects are injected into tests.
-   Type safety: TypeScript models describe payloads.
-   Runtime validation: Zod validates response structure.
-   Reusable test data: payload factory functions reduce duplication.
-   Authentication reuse: token is passed as a cookie for protected
    operations.
-   Cleanup: tests attempt to remove created test data.
-   Separation of concerns: API methods, data, types, schemas, and tests
    are separated.
-   CI-aware settings: configuration supports retries, worker limits,
    and `forbidOnly` in CI.

## 10. Known limitations

1.  The demo API is public and shared; it can be unavailable or reset
    its data.
2.  Status codes and response bodies are specific to Restful Booker and
    may differ from another API.
3.  Only demo credentials should be used locally. For real projects, use
    a CI secret store.
4.  Shared services can introduce race conditions despite generated test
    data.
5.  The schemas cover the fields currently used by this framework;
    extend them as coverage grows.
6.  This is a learning/interview framework, not a claim of complete API
    coverage.

## 11. Recommended next enhancements

-   Add malformed payload, missing-field, boundary-date, and
    invalid-data-type tests.
-   Add reusable response/header assertions.
-   Add local/QA/staging environment profiles.
-   Integrate execution into Jenkins or GitHub Actions.
-   Publish HTML reports as CI artifacts.
-   Add smoke/regression tags and contract checks.
-   Add structured logging without printing tokens, passwords, or other
    secrets.

## 12. References

-   [Playwright API testing
    documentation](https://playwright.dev/docs/api-testing)
-   [Restful Booker demo API](https://restful-booker.herokuapp.com/)
-   [Restful Booker API
    documentation/workspace](https://www.postman.com/servicerocket/servicerocket-s-public-workspace/documentation/b5xnda6/restful-booker?entity=request-4805376-ba15d29d-cb6f-4de1-b8ff-1c3abfa6d3ce)

------------------------------------------------------------------------

**Maintenance note:** Keep this README synchronized with actual files
and npm scripts. Update the matching sections whenever a test or script
is renamed.

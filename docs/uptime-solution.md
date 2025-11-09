# Uptime Tracking Solution

## Problem

The original health controller in `services/user-service/src/controllers/health.controller.ts` was using `process.uptime()` directly, which could fail in certain environments where the Node.js `process` object is not available (e.g., serverless environments, edge functions, or during testing).

## Solution

We've created a robust uptime tracking utility that works across different environments:

### 1. Local Implementation

Created `services/user-service/src/utils/uptime.util.ts` with:
- `getSafeUptime()`: Safely gets uptime in seconds with fallback mechanism
- `getFormattedUptime()`: Returns a human-readable uptime string

The utility:
1. First tries to use `process.uptime()` if available
2. Falls back to calculating uptime based on the application start time
3. Uses `globalThis` to safely check for the process object

### 2. Shared Package

Created a shared package at `shared/` to standardize this utility across all services:
- `shared/src/utils/uptime.util.ts`: The same utility as in user-service
- `shared/package.json`: Package configuration
- `shared/tsconfig.json`: TypeScript configuration
- `shared/src/index.ts`: Exports for the package
- `shared/README.md`: Usage instructions

### 3. Updated Health Controller

Modified `services/user-service/src/controllers/health.controller.ts` to use the new utility:
- Replaced `process.uptime()` with `getSafeUptime()` from the utility
- Added import for the uptime utility

## Benefits

1. **Cross-environment compatibility**: Works in Node.js, serverless, and edge environments
2. **Fallback mechanism**: Continues to function even if process object is unavailable
3. **Standardization**: Can be reused across all microservices
4. **Type safety**: Proper TypeScript support with type definitions
5. **Testing**: Utility can be easily mocked and tested

## Usage in Other Services

To use this in other services:

1. Build the shared package:
```bash
cd shared
npm install
npm run build
```

2. Install in your service:
```bash
cd ../your-service
npm install ../shared
```

3. Use in your health controller:
```typescript
import { getSafeUptime } from '@notification-system/shared';

// In your health check method
uptime: getSafeUptime()
```

## Future Enhancements

1. Add more health metrics (memory usage, CPU, etc.)
2. Create a standardized health response interface
3. Add health check dependencies (database, external services)
4. Implement health check thresholds and alerts
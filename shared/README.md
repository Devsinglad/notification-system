# @notification-system/shared

Shared utilities, types, and interfaces for the notification system microservices.

## Installation

To use this package in your service:

1. First, build the shared package:
```bash
cd shared
npm install
npm run build
```

2. Then install it in your service:
```bash
cd ../your-service
npm install ../shared
```

Or if you're publishing to a registry:
```bash
npm install @notification-system/shared
```

## Available Utilities

### Uptime Utility

The uptime utility provides a safe way to track application uptime across different environments, including serverless environments where the `process` object might not be available.

```typescript
import { getSafeUptime, getFormattedUptime } from '@notification-system/shared';

// Get uptime in seconds
const uptimeSeconds = getSafeUptime();

// Get formatted uptime string (e.g., "2 days, 3 hours, 45 minutes")
const formattedUptime = getFormattedUptime();
```

## Development

To develop the shared package:

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Watch for changes
npm run dev
```

## Publishing

To publish a new version:

1. Update the version in package.json
2. Build the package: `npm run build`
3. Publish: `npm publish`
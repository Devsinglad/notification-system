# System Architecture Overview


![](./system-architecture.drawio.svg)

### Core Technologies
- **Language**: TypeScript
- **Framework**: Node.js + NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Queue System**: RabbitMQ
- **Cache & Rate Limiting**: Redis
- **Email Provider**: SendGrid
- **Containerization**: Docker
- **API Documentation**: Swagger/OpenAPI
- **Deployment Platform**: Leapcell Server

### Key Architecture Changes:

#### 1. Database Layer (PostgreSQL + Prisma)
- **Relational database** with ACID compliance for data integrity
- **Prisma ORM** for type-safe database operations and migrations
- **Structured schemas** for users, notifications, templates, and delivery tracking
- **Connection pooling** for optimal performance

#### 2. Dual-Purpose Messaging
- **RabbitMQ** for reliable message queuing and service communication
- **Redis** for caching, rate limiting, and session management
- **Clear separation** between persistent messaging (RabbitMQ) and fast caching (Redis)

#### 3. Enhanced Service Communication
- **Prisma models** shared across services for consistent data access
- **Type-safe database operations** with Prisma Client
- **Optimized queries** with Prisma's query engine
- **Database migrations** managed through Prisma

#### 4. Email Integration
- **SendGrid API** for reliable email delivery
- **Template management** through SendGrid templates
- **Delivery tracking** and analytics
- **Bulk email capabilities** for marketing campaigns

#### 5. Deployment Architecture
- **Leapcell server** for container orchestration
- **Docker containers** for each microservice
- **Environment-specific configurations** for development/production
- **Auto-scaling** capabilities based on load

### Service Communication Flow:
1. **API Gateway** routes requests to appropriate services
2. **Services** use PostgreSQL for data persistence via Prisma
3. **RabbitMQ** handles asynchronous communication between services
4. **Redis** provides caching and rate limiting for performance
5. **External services** (SendGrid, FCM) handle actual delivery
6. **Leapcell** orchestrates deployment and scaling

This architecture provides a robust, scalable foundation for the real-time notification system with strong type safety, reliable messaging, and optimized performance.
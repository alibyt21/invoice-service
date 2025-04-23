# 🧾 Invoice & Daily Sales Report System

This project is a backend system built with NestJS, MongoDB, and RabbitMQ to manage sales invoices and generate daily sales reports. It consists of two main services:

1. **Invoice Service** - Responsible for creating invoices and generating daily sales reports.
2. **Email Sender Service** - A separate service that consumes reports from a RabbitMQ queue and sends them via email (mocked).

---

## 📁 Project Structure

```
.
├── invoice-service/
│   ├── src/
│   ├── test/
│   └── Dockerfile
├── email-sender/
│   ├── src/
│   ├── test/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Technologies Used

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [RabbitMQ](https://www.rabbitmq.com/)
- Cron Jobs (using `@nestjs/schedule`)
- Docker & Docker Compose
- Supertest & Jest (for testing)

---

## ⚙️ Setup Instructions

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd <repository-root>
```

### 2. Install Dependencies

Install dependencies for both services:

```bash
cd invoice-service && npm install
cd ../email-sender && npm install
```

### 3. Run with Docker

Use Docker Compose to start MongoDB, RabbitMQ, and both services:

```bash
docker-compose up --build
```

The services will start on:

- **Invoice Service**: http://localhost:3000
- **RabbitMQ Management UI**: http://localhost:15672 (username: guest, password: guest)

---

## 📬 API Endpoints (Invoice Service)

| Method | Endpoint            | Description                   |
|--------|---------------------|-------------------------------|
| POST   | `/invoices`         | Create a new invoice          |
| GET    | `/invoices/:id`     | Get invoice by ID             |
| GET    | `/invoices`         | Get all invoices (with filter) |

Optional query params for filtering:
- `startDate` — filter by start date
- `endDate` — filter by end date

---

## 📆 Cron Job: Daily Sales Report

The `invoice-service` generates a report daily at **12:00 PM** (server time). This includes:

- Total sales amount
- Per-item quantities (grouped by SKU)

The report is sent to RabbitMQ queue: `daily_sales_report`.

---

## 📨 Email Sender Service

The `email-sender` service listens to the `daily_sales_report` queue and:

- Receives sales summary reports
- Logs a **mock email** with formatted content

You can find logs in the terminal as proof of email "sending."

---

## 🧪 Testing

### Unit Tests

Both services include unit tests using **Jest**.

### Integration Tests

The invoice service includes API integration tests using **Supertest**.

To run tests:

```bash
# In each service directory
npm run test
```

---

## 🧼 Submission Notes

- `node_modules`, `.git`, and `dist` folders are excluded from ZIP.
- All services are cleanly separated with clear structure and Docker support.
- Error handling and logging are implemented for all critical paths.

---

## 👨‍💻 Author Notes

This project is a complete implementation of a microservice-based invoice system designed to demonstrate:

- REST API development with NestJS
- MongoDB schema design and filtering
- Cron-based task scheduling
- Message queuing with RabbitMQ
- Email report processing
- Docker-based service orchestration
- Professional testing practices

---

## 📮 Contact

For any inquiries (after submission 😊):

**Email:** alibyt21@gmail.com

# Farmer-to-Buyer Direct Linkage Platform

SIH Problem Statement: **SIH26033**
Theme: Agriculture, FoodTech & Rural Development

A digital platform that directly connects farmers with verified buyers —
removing unnecessary intermediaries, improving price transparency, and
helping farmers make better selling decisions through a smart **Buyer
Trust & Match Score**.

## Structure

```
farmer-buyer-platform/
├── front-end/    # React frontend
├── back-end/    # Node.js / Express backend
└── docs/      # Project synopsis & documentation
```

## Key Features

- Farmer & Buyer registration with digital profiles
- Produce listing (crop, quantity, quality, price, availability)
- Smart Farmer-Buyer Matching with a **Buyer Trust & Match Score**
- Net earnings estimator (price minus transportation cost)
- Order management (request → accept → confirm → track)
- Transaction history and ratings/feedback

## Tech Stack

- **Frontend:** React, HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Other:** REST APIs, JWT auth, Maps/GPS integration

## Getting Started

### Prerequisites
- Node.js (v18+) and npm
- MongoDB (local instance or a MongoDB Atlas connection string)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/farmer-buyer-platform.git
cd farmer-buyer-platform
```

### 2. Set up the backend
```bash
cd back-end
npm install
cp .env.example .env   # fill in your MongoDB URI and JWT secret
npm run dev
```
Server runs on `http://localhost:5000` by default.

### 3. Set up the frontend
```bash
cd front-end
npm install
cp .env.example .env   # set REACT_APP_API_URL if needed
npm start
```
Client runs on `http://localhost:3000` by default.

## API Overview

| Method | Endpoint                  | Description                            |
|--------|----------------------------|-----------------------------------------|
| POST   | `/api/farmers/register`    | Register a new farmer                  |
| POST   | `/api/buyers/register`     | Register a new buyer                   |
| POST   | `/api/produce`              | Add a produce listing                  |
| GET    | `/api/produce`              | List/search/filter produce             |
| GET    | `/api/match/:produceId`     | Get ranked buyer matches for a listing |
| POST   | `/api/orders`               | Create an order                        |
| PATCH  | `/api/orders/:id/status`    | Update order status                    |

Full details in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md).

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes with clear messages
3. Push and open a Pull Request

## License

Licensed under the MIT License — see [LICENSE](LICENSE).

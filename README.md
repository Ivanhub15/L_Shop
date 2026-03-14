# L_Shop - Online Store

A full-stack e-commerce application built with Express.js + TypeScript (backend) and vanilla TypeScript (frontend).

## Features

- 🛍️ Product catalog with search, filtering, and sorting
- 👤 User registration and authentication
- 🛒 Shopping cart management
- 📦 Order placement and delivery
- 💾 Persistent data storage (JSON-based)
- 🔐 Secure session management with HTTP-only cookies
- 🎨 Responsive design

## Tech Stack

### Backend
- **Node.js + Express.js** - REST API server
- **TypeScript** - Type-safe code
- **Express** middleware - CORS, cookie parsin

### Frontend
- **Vanilla TypeScript** - No frameworks (custom SPA framework)
- **Vanilla CSS** - Responsive styling
- **ES Modules** - Modern JavaScript modules
- **esbuild** - Fast bundling

## Project Structure

```
L_Shop/
├── src/                          # Backend source code
│   ├── controllers/              # Business logic
│   │   ├── userController.ts
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   ├── orderController.ts
│   ├── routes/                   # Express routes
│   ├── models/                   # TypeScript interfaces
│   ├── middlewares/              # Express middleware
│   ├── data/                     # JSON data storage
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
├── frontend/                     # Frontend source code
│   ├── api/                      # API client functions
│   ├── components/               # Reusable components
│   ├── pages/                    # SPA pages
│   ├── router/                   # Custom router
│   ├── store/                    # State management
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Helper utilities
│   ├── styles/                   # CSS styles
│   ├── main.ts                   # App entry point
│   └── index.html                # HTML template
├── dist/                         # Compiled backend
├── package.json
└── tsconfig.json
```

## Installation

```bash
npm install
```

## Development

Run both backend and frontend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
npm run backend      # Terminal 1
npm run frontend     # Terminal 2
```

## Build

```bash
npm run build
```

## Running Production

```bash
npm start
```

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/me` - Get current user

### Products
- `GET /api/products` - Get all products with optional filtering
  - Query params: `search`, `category`, `available`, `sort`

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `POST /api/cart/remove` - Remove product from cart
- `POST /api/cart/update` - Update product quantity in cart

### Orders
- `POST /api/order` - Create order and checkout

## Data Models

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  cart: CartItem[];
}
```

### Product
```typescript
{
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}
```

### CartItem
```typescript
{
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  quantity: number;
}
```

## Authentication

- Uses HTTP-only cookies for session management
- Session expires after 10 minutes of inactivity
- CORS configured to allow credentials

## SPA Routing

The frontend implements a custom single-page application with client-side routing:

- `/` - Home (product listing)
- `/login` - Login page
- `/register` - Registration page
- `/cart` - Shopping cart
- `/delivery` - Order delivery & checkout

## Development Notes

- The frontend uses esbuild for fast bundling
- TypeScript strict mode is enabled throughout
- No use of `any` type - all code is properly typed
- CORS is configured to work with frontend on port 5500
- Data is persisted to JSON files in `src/data/`

## License

ISC

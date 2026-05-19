# 🚀 StockSmart - Premium Inventory Management System

A full-stack, enterprise-grade **Inventory & Point of Sale Management System** built with a stunning **Dark Glassmorphism** user interface and a robust backend utilizing **Clean Architecture** principles.

## ✨ Key Features
- **Secure Authentication**: JWT-based login system with frontend route protection and automated session handling.
- **Inventory Control**: Comprehensive CRUD management for products. Built-in validation prevents negative stock and pricing.
- **Client Roster (CRM)**: Manage customer details seamlessly to track purchase histories and outstanding balances.
- **Point of Sale (POS)**: A dynamic checkout system that links inventory, customers, and payments in a single transaction. Automatically updates stock and ledger balances upon completion.
- **Transactions Ledger**: A dedicated reporting dashboard tracking all historical sales, payment methods (Cash vs. Credit), and dates.
- **Dynamic Exports**: Generate and download meticulously formatted PDF and Excel (`.xlsx`) sales reports directly from the dashboard.
- **Premium UI/UX**:
  - `Plus Jakarta Sans` typography.
  - Deep dark slate themes with vibrant gradients and animated mesh backgrounds.
  - Custom glass panels, floating sidebars, and fluid micro-animations.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Custom Glassmorphism Utility Classes)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with custom interceptors)
- **Icons**: Lucide React

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Architecture**: SOLID & Clean Architecture (Separation of Domain, Application, Infrastructure, and Presentation layers)
- **Security**: bcryptjs (Hashing) & jsonwebtoken (JWT Auth)
- **Exports**: `pdfkit` (PDF Generation) & `exceljs` (Excel Workbooks)

---

## 📂 Architecture Overview

The backend strictly adheres to **Clean Architecture**, completely decoupling business logic from external frameworks:
- **Domain Layer**: Contains core Business Entities (`Item`, `Customer`, `Sale`) and Repository Interfaces.
- **Application Layer**: Contains Use Cases (`CreateItemUseCase`, `RecordSaleUseCase`). Acts as the orchestrator.
- **Infrastructure Layer**: Concrete implementations of Repositories (`ItemRepository`) and Services (`ExportService`, `JwtService`, `HashService`). Interacts directly with MongoDB.
- **Presentation Layer**: Express Controllers and Routes.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

### 2. Installation

Clone the repository and install dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inventory_management
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Database Seeding (Optional)
To create an initial Admin user so you can log in, run the seed script from the `backend/` directory:
```bash
npm run seed:admin
```
*(Default Admin Credentials: `admin@stocksmart.io` / `admin123`)*

### 5. Running the Application

You'll need two terminal windows to run both servers concurrently.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🎨 Design System Note
The user interface is powered by custom utility classes defined in `frontend/src/index.css`. The primary design tokens include `.glass-panel`, `.glass-card`, and `.glass-input`. These utilities leverage Tailwind's `backdrop-blur` and composite shadow properties to achieve the frosted glass aesthetic.

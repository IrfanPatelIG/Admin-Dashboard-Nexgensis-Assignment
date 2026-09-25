
# Admin Dashboard

A responsive React admin dashboard built with Vite and DummyJSON API.

#
### Live: [View live](https://solariq-live.vercel.app/)
#

## Setup

### 1. Clone the repository

```bash
git clone "https://github.com/IrfanPatelIG/Admin-Dashboard-Nexgensis-Assignment.git"
cd "Admin Dashboard Nexgensis"
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL shown in the terminal.

### Login

Use the assignment credentials:

* **Username:** `emilys`
* **Password:** `emilyspass`

## Features

- User authentication and protected routes
- Axios API layer
- Product listing with pagination
- Responsive for desktop and mobile
- URL state for search, category, sort, and page to persist page data
- Add, edit, and delete products operations
- Debounced search with request cancellation
- Category filtering and product sorting
- Combined search, filtering, and sorting
- Loading and error handling
- Product details

## Project Structure

```text
src/
├── api/           # API requests
├── controllers/   # Business and data logic
├── components/    # Reusable components
├── pages/         # Page and UI logic
└── App.jsx        # Routes
```

## Implementation Notes & Challenges

### Code Organization

One of the main challenges was keeping the code manageable as features increased. I separated responsibilities into different layers:

* `api/` handles Axios/API requests
* `controllers/` handles business and data logic
* `pages/` handles UI and page-level state
* `components/` contains reusable UI components

### Search, Filter and Sort

Another challenge was making search, category filtering, and sorting work correctly both independently and in combination. I handled these cases through the product controller and applied filtering, sorting, and pagination in the correct order.

### Responsive Design

The product list uses a desktop table and mobile card layout to keep the dashboard usable across different screen sizes.

## AI Assistance

AI was used mainly for debugging, UI imporvement, request cancellation/race-condition handling, and combining search, filtering, sorting, and pagination correctly.
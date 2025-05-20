Product Management System
Author : Nguyễn Dương Huy

A RESTful API system for managing products with features like authentication, search, filtering, and caching.

## Features

### Authentication
- User registration
- User login with JWT
- Protected routes using JWT authentication

### Product Management
- Create, read, update, and delete products
- Search products by multiple criteria
- Filter products by category and subcategory
- Sort products by various fields
- Pagination support
- API response caching

### Product Interaction
- Like/Unlike products
- Track product likes count
- View liked products

## Prerequisites
- Node.js (v14 or higher)
- MySQL
- npm or yarn

## Installation
1. Clone the repository:
```bash
git clone https://github.com/ndhuy2711/products-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=product_management
JWT_SECRET=your_jwt_secret

4. Start the application:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Documentation

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "ndhuy2711@gmail.com",
  "password": "123456",
  "name": "Nguyễn Dương Huy"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ndhuy2711@gmail.com",
  "password": "123456"
}
```

### Products

#### Get All Products
```http
GET /products?page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Get Product by ID
```http
GET /products/:id
Authorization: Bearer <jwt_token>
```

#### Create Product
```http
POST /products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "category": "Electronics",
  "subcategory": "Phones",
  "stock": 100
}
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99
}
```

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <jwt_token>
```

### Search Products

#### Search with Filters
```http
GET /products/search?q=keyword&category=Electronics&minPrice=50&maxPrice=200&minLikes=10
Authorization: Bearer <jwt_token>
```

Query Parameters:
- `q`: Search keyword
- `category`: Product category
- `subcategory`: Product subcategory
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `minLikes`: Minimum likes count
- `sortBy`: Field to sort by (default: createdAt)
- `order`: Sort order (ASC/DESC)

### Product Likes

#### Like Product
```http
POST /products/:id/like
Authorization: Bearer <jwt_token>
```

#### Unlike Product
```http
DELETE /products/:id/like
Authorization: Bearer <jwt_token>
```

## Caching

The system implements caching for GET requests to improve performance:
- Cache duration: 5 minutes
- Cache is automatically invalidated when:
  - New product is created
  - Product is updated
  - Product is deleted
  - Product is liked/unliked

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

### Running Tests
```bash
npm run test
```
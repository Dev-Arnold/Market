# Market - Social Commerce Backend

A Node.js backend for a social commerce application where users can create posts with products, interact through likes and comments, and discover content through search.

## Features

- **Authentication**: JWT-based auth with HTTP-only cookies
- **User Management**: Profile creation, updates, and seller profiles
- **Posts**: Create, read, update, delete posts with media upload
- **Social Features**: Like/unlike posts, add comments
- **Feed System**: Paginated posts feed
- **Search**: Search users and posts
- **Media Upload**: Cloudinary integration for images/videos
- **Security**: Rate limiting, CORS, input sanitization

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for media storage
- bcryptjs for password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/market
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id/profile` - Get seller profile
- `GET /api/users/search?q=query` - Search users

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comments` - Add comment
- `GET /api/posts/search?q=query` - Search posts

## Project Structure

```
src/
├── config/          # Database and Cloudinary config
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # Express routes
├── utils/           # Utility functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```
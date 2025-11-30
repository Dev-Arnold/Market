# Market API Documentation

**Base URL:** `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a valid JWT token in HTTP-only cookies. Login/Register automatically sets the cookie.

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "bio": "",
    "avatar": "",
    "phoneNumber": "",
    "city": ""
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Logout User
```http
GET /auth/logout
```

### Get Current User
```http
GET /auth/me
Authorization: Required (Cookie)
```

---

## 👤 User Endpoints

### Update Profile
```http
PUT /users/profile
Authorization: Required (Cookie)
Content-Type: multipart/form-data

{
  "firstName": "Jane",
  "lastName": "Smith",
  "userName": "janesmith",
  "bio": "Updated bio",
  "phoneNumber": "+1234567890",
  "city": "New York",
  "avatar": [file] // Optional image file
}
```

### Get Seller Profile
```http
GET /users/{userId}/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "userName": "johndoe",
      "bio": "Seller bio",
      "avatar": "cloudinary_url",
      "city": "New York"
    },
    "posts": [...],
    "stats": {
      "postsCount": 5,
      "totalLikes": 25
    }
  }
}
```

### Search Users
```http
GET /users/search?q=john
```

---

## 📱 Post Endpoints

### Get All Posts (Feed)
```http
GET /posts?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "pagination": {
    "next": { "page": 2, "limit": 20 }
  },
  "data": [
    {
      "id": "post_id",
      "user": {
        "id": "user_id",
        "userName": "johndoe",
        "avatar": "cloudinary_url",
        "city": "New York"
      },
      "mediaUrl": "cloudinary_url",
      "caption": "Check out this product!",
      "price": 99.99,
      "likes": ["user_id1", "user_id2"],
      "likesCount": 2,
      "comments": [...],
      "commentsCount": 5,
      "createdAt": "2023-12-01T10:00:00Z"
    }
  ]
}
```

### Create Post
```http
POST /posts
Authorization: Required (Cookie)
Content-Type: multipart/form-data

{
  "caption": "Amazing product for sale!",
  "price": 99.99,
  "media": [file] // Required image/video file
}
```

### Get Single Post
```http
GET /posts/{postId}
```

### Update Post
```http
PUT /posts/{postId}
Authorization: Required (Cookie)
Content-Type: application/json

{
  "caption": "Updated caption",
  "price": 89.99
}
```

### Delete Post
```http
DELETE /posts/{postId}
Authorization: Required (Cookie)
```

### Like/Unlike Post
```http
PUT /posts/{postId}/like
Authorization: Required (Cookie)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "likes": 5,
    "isLiked": true
  }
}
```

### Add Comment
```http
POST /posts/{postId}/comments
Authorization: Required (Cookie)
Content-Type: application/json

{
  "text": "Great product!"
}
```

### Search Posts
```http
GET /posts/search?q=product
```

---

## 📋 Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🔒 Authentication Notes

- **Cookies:** JWT tokens are stored in HTTP-only cookies
- **CORS:** Enabled for `http://localhost:3000` in development
- **Protected Routes:** Require valid JWT token in cookie
- **Token Expiry:** 30 days

---

## 📝 Validation Rules

### User Registration
- `firstName`: Required, max 50 chars
- `lastName`: Required, max 50 chars  
- `userName`: Required, 3-30 chars, unique
- `email`: Required, valid email format, unique
- `password`: Required, min 6 chars

### Posts
- `caption`: Required, max 1000 chars
- `price`: Required, min 0
- `media`: Required file (image/video)

### Comments
- `text`: Required, max 500 chars

---

## 🚀 Getting Started

1. **Register** a user account
2. **Login** to get authentication cookie
3. **Create posts** with media files
4. **Interact** with posts (like, comment)
5. **Search** for users and posts

**Note:** All file uploads go to Cloudinary. Supported formats: jpg, jpeg, png, gif, mp4, mov, avi
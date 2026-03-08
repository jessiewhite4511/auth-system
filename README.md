# Authentication System Project

A Node.js authentication system with signup, login, OTP verification, email verification, password validation, Input validation, rate limiting, Redis caching, ETag, session tracking, email queue, worker process, and mailer.

Clone and install:

git clone: git remote add origin https://github.com/jessiewhite4511/auth-system.git
cd: auth-system
npm install

Create a .env file in the root folder:

PORT=5000
MONGO_URI= mongodb://localhost:27017/myapp

REDIS_HOST= 127.0.0.1
REDIS_PORT= 6379

JWT_SECRET= your_jwt_secret

EMAIL_SERVICE= smtp.mailtrap.io
EMAIL_USER= your_mailtrap_user
EMAIL_PASS= your_mailtrap_pass

## Redis Setup

This project uses Redis for caching idempotency keys, OTPs, and temporary data.  
Run Redis via Docker Desktop:
docker run -d --name redis -p 6379:6379 redis
Add these to your .env file in the project root:
REDIS_HOST=127.0.0.1   # Docker Desktop Redis host
REDIS_PORT=6379        # Redis default port
Note: Ensure the Redis container is running before starting the Node.js server. You can check running containers with:
docker ps

Start server:

node server.js

Start worker (for email queue):

node worker/workers.js

Run the script below to create the first admin user:

node createAdmin.js

API Endpoints:

POST /api/users/signup
Request Body:
{
  "firstname": "John",
  "lastname": "jim",
  "username": "johnjim",
  "email": "bb@example.com",
  "password": "123456"
}
Response:
{
  "message": "Signup Successful. Verify your email",
  "newUser": {
    "email": "bb@example.com",
    "firstname": "John",
    "lastname": "jim",
    "username": "johnjim",
    "isVerified": false
  }
}

POST /api/users/login
Request Body:
{
  "email": "bb@example.com",
  "password": "123456"
}

When a user logs in from a new IP address, the system triggers OTP verification.

Current behavior:

- First login attempt from a new IP sets newIp = true.
- The session is updated with the new IP.
- The user must log in a second time to receive and verify the OTP.

Note: The implementation currently sets newIp to true on login instead of checking if session.ip !== request.ip.

Notes:
- Rate limiting applies (max 5 attempts) both in middleware and inside login logic
- Input validator verifies inputs and password length


Response:
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "user": { ...userData }
}

POST /api/users/verifyotp
Request Body:
{
  "email": "bb@example.com",
  "otp": "123456"
}
Response:
{
  "message": "Otp Verified. Login successful",
  "token": "<jwt-token>",
  "user": { ...userData }
}

POST /api/users/verifyemail?token=<token>
Response:
{
  "message": "Verified"
}

GET /api/auth/id
Description: Get authenticated user account

Headers:
Authorization: Bearer <jwt-token>

Response:
"user": { ...userData }

Features:

- Signup with email verification
- Login with password validation and rate limiting
- OTP verification for login from new IP
- Session tracking (IP, device, last login time)
- Password hashing with bcrypt
- Input validation (prevent SQL injection) in signup and login
- Redis cache for idempotency keys and temporary data
- ETag support for caching responses
- Email queue for sending verification emails and OTP asynchronously
- Worker process listens to queue and sends emails
- Mailer module for email handling
- Admin routes for user management

Middlewares:

- Rate limiter (login route)
- Validator (signup and login)
- isAuthenticated
- isAdmin

Extras:

- Redis cache stores idempotency keys for signup and email verification
- Email queue sends verification and OTP emails asynchronously
- Worker process handles sending queued emails
- Sessions track device ID, device type, IP, creation and last active time
- Security: bcrypt for password hashing, JWT for authentication, OTP for new IP login

Folder Structure:

config/
controller/
middlewares/
model/
routes/
uploads/
utils/
worker/
.env
createAdmin.js
README.md
server.js

Contributing:

1. Fork the repository
2. Create a branch
3. Make changes
4. Submit a pull request

License:

MIT


---
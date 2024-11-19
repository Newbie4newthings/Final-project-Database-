# Loan Wizard - API Documentation

The Loan Wizard app provides a RESTful API for interacting with user data, loan applications, repayment schedules, and transaction history. Below is a detailed guide on how to interact with each API endpoint.

## Base URL
All API endpoints are accessed through the following base URL:
http://localhost:3000/api


## Authentication
The app uses **session-based authentication**. After logging in with the correct credentials, the session is stored, and subsequent requests must include the session to access protected routes.

### Authentication Flow:
1. **User Login**: Use the `POST /api/login` endpoint to authenticate the user. Upon successful login, a session is created, which is used for all protected routes.
2. **Session Management**: Session cookies are automatically sent in subsequent requests.

## API Endpoints

### 1. **User Registration**

- **URL**: `/users`
- **Method**: `POST`
- **Description**: Registers a new user in the system.
- **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "securepassword123"
    }
    ```
- **Response**:
    - **Status 201**: User successfully registered.
    - **Status 400**: Bad request (missing fields, invalid email format).
  
### 2. **User Login**

- **URL**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user and creates a session.
- **Request Body**:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "securepassword123"
    }
    ```
- **Response**:
    - **Status 200**: Login successful. Session created.
    - **Status 401**: Unauthorized (invalid credentials).
  
### 3. **Get User Details**

- **URL**: `/users/me`
- **Method**: `GET`
- **Description**: Fetches details of the currently authenticated user.
- **Headers**:
    - **Authorization**: Session cookie (auto-sent by the client).
- **Response**:
    - **Status 200**: Returns the user's profile details:
      ```json
      {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com",
        "loans": [...]
      }
      ```
    - **Status 401**: Unauthorized (no session found).

### 4. **Apply for a Loan**

- **URL**: `/loans`
- **Method**: `POST`
- **Description**: Allows an authenticated user to apply for a loan.
- **Request Body**:
    ```json
    {
      "amount": 5000,
      "term": 12,
      "interest_rate": 5.5
    }
    ```
- **Response**:
    - **Status 201**: Loan application created successfully.
    - **Status 400**: Bad request (invalid loan amount or term).

### 5. **Get User's Loans**

- **URL**: `/loans`
- **Method**: `GET`
- **Description**: Fetches all loans for the currently authenticated user.
- **Headers**:
    - **Authorization**: Session cookie.
- **Response**:
    - **Status 200**: Returns an array of loans:
      ```json
      [
        {
          "loan_id": 1,
          "amount": 5000,
          "term": 12,
          "interest_rate": 5.5,
          "status": "active",
          "repayments": [...]
        }
      ]
      ```
    - **Status 401**: Unauthorized (no session).

### 6. **Repay Loan**

- **URL**: `/repayments`
- **Method**: `POST`
- **Description**: Allows an authenticated user to make a repayment towards an active loan.
- **Request Body**:
    ```json
    {
      "loan_id": 1,
      "amount": 200
    }
    ```
- **Response**:
    - **Status 200**: Repayment successful.
    - **Status 400**: Bad request (invalid loan ID or amount).

### 7. **Get Transaction History**

- **URL**: `/transactions`
- **Method**: `GET`
- **Description**: Fetches all transactions for the authenticated user (loans, repayments).
- **Headers**:
    - **Authorization**: Session cookie.
- **Response**:
    - **Status 200**: Returns an array of transactions:
      ```json
      [
        {
          "transaction_id": 1,
          "loan_id": 1,
          "transaction_type": "repayment",
          "amount": 200,
          "date": "2024-11-10T14:00:00Z"
        }
      ]
      ```
    - **Status 401**: Unauthorized (no session).

## Error Handling

If an error occurs, the API will return a JSON response with an error message.

### Example Error Response:
```json
{
  "error": "Invalid credentials"
}

### Common HTTP Status Codes:

200 OK: The request was successful.
201 Created: A resource was successfully created (e.g., user, loan).
400 Bad Request: The request was invalid or malformed.
401 Unauthorized: Authentication required or failed.
404 Not Found: Resource not found.
500 Internal Server Error: A server error occurred.

---

This **API Documentation** file covers the endpoints that users can interact with, providing a detailed breakdown of how to register, login, manage loans, make repayments, and view transaction history. It also includes the required HTTP methods, request body formats, and expected responses for each endpoint.

# Newbie4newthings-Database-Design-Programming-with-SQL-V2-Final-Project
This is my final project for Database Design Programming with SQL

```markdown
# Loan Wizard - Web Application

## Overview
Loan Wizard is a web application designed to manage loans, repayments, and transactions in a fantasy-themed environment. Users can register, apply for loans, track repayments, and view transaction history. It uses session-based authentication to ensure that only authorized users can access their data.

## Features
- **User Registration & Login**: Secure login and registration system.
- **Loan Management**: Apply for loans, check loan details, and manage repayments.
- **Interest Rate Management**: Admins can update loan interest rates.
- **Transaction History**: Track transactions and repayments over time.
- **Secure Authentication**: User sessions are managed for secure access to loan data.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: Express sessions
- **Frontend**: HTML, CSS (with a whimsical design)
- **Environment Variables**: dotenv
- **CORS**: To enable cross-origin requests from frontend

## Installation Guide

### Prerequisites
- **Node.js** (14.x or higher)
- **npm** (Node Package Manager)
- **MySQL** (8.x or higher)

### Steps to Set Up Locally
1. **Clone the Repo**:
   ```bash
   git clone [https://github.com/Newbie4newthings/Newbie4newthings-Database-Design-Programming-with-SQL-V2-Final-Project.git]
   cd loan-wizard
2. **Install Dependencies**:Inside the project directory, install the required Node.js dependencies:
    ```bash
    Copy code
    npm install
3. **Set Up Environment Variables:**:Create a .env file in the root directory of the project and add the following variables:
    SESSION_SECRET= your_secret_key
    DB_HOST= localhost
    DB_USER= your_db_user
    DB_PASSWORD= your_db_password
    DB_NAME= your_db_name
    CORS_ORIGIN= http://localhost:3000
    PORT=3000
4. **Set Up MySQL Database:**:
    Open your mySql workbench and paste the loan_wizard Creation Code.sql to create the database 

5. **Start the Application:**:In the project directory, run:
``bash
npm start

6. **Start the Application:**:
Access the App: Open your browser and navigate to http://localhost:3000. The app should now be running locally.

Screenshots of app

![login page](image.png)
![loan dashboard](image-1.png)
![loan dashboard-transaction](image-2.png)
![loan dashboard-repayment](image-3.png)
![register page](image-4.png)
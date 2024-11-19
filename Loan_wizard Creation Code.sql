-- Create the database
CREATE DATABASE loan_wizard;

-- Select the database
USE loan_wizard;

-- Users Table: Stores the heroes (borrowers)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    hero_level ENUM('beginner', 'apprentice', 'master') DEFAULT 'beginner',
    magic_email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(225),
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Amounts Table: Details of loans and the magical coins borrowed
CREATE TABLE LoanAmounts (
    loan_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    coin_amount DECIMAL(10, 2) NOT NULL,
    loan_start_date TIMESTAMP DEFAULT NOW(),
    loan_status ENUM('active', 'closed', 'defaulted') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Interest Rates Table: Tracks the cost of borrowing
CREATE TABLE InterestRates (
    interest_rate_id INT PRIMARY KEY AUTO_INCREMENT,
    loan_id INT,
    interest_rate_percent DECIMAL(5, 2) NOT NULL,
    applied_date TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (loan_id) REFERENCES LoanAmounts(loan_id)
);

-- Repayment Schedules Table: Keeps the repayment due dates and amounts
CREATE TABLE RepaymentSchedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    loan_id INT,
    due_date DATE NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    status ENUM('paid', 'unpaid', 'overdue') DEFAULT 'unpaid',
    term_days INT,
    FOREIGN KEY (loan_id) REFERENCES LoanAmounts(loan_id)
);

-- Transaction Histories Table: Tracks each payment or transaction
CREATE TABLE TransactionHistories (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    loan_id INT,
    transaction_date TIMESTAMP DEFAULT NOW(),
    amount_paid DECIMAL(10, 2) NOT NULL,
    remaining_balance DECIMAL(10, 2),
    remarks TEXT,
    FOREIGN KEY (loan_id) REFERENCES LoanAmounts(loan_id)
);

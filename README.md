# Inventory Management System

✨ Kicking off 2025 with Node.js! ✨

This is my personal project, built during the New Year holiday, designed to simplify inventory operations with a centralized warehouse model. The system manages stock inflows from external sources, outflows to shop outlets, and provides real-time updates for tracking stock movements and transactions.

## Features

- 🔄 **Warehouse Operations**: Manage stock inflows from external sources and outflows to shop outlets seamlessly.
- 🏬 **Shop Transactions**: Shop outlets can accept incoming stock, manage their inventory, and record stock outflows when items are sold.
- 📊 **Real-Time Updates**: Track stock availability, movements, and transactions in real time.
- 🔒 **Secure and Reliable**: Built with JWT authentication, data validation, and audit logs for transparency and security.

## Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi and MongoDB schema validations
- **Project Structure**: Based on the scalable Node.js Express Boilerplate

## Project Setup

Follow these steps to get the project up and running on your local machine.

### 1. Configure `.env` File

Copy the `.env.example` file to `.env` and configure the necessary environment variables, including your MongoDB URI and JWT secret.

```bash
cp .env.example .env
npm install
npm run dev

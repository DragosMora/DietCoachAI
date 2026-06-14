"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Database connection configuration
// Uses variables from .env or default values corresponding to the proposed docker-compose
const pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'dietcoach',
});
pool.on('error', (err) => {
    console.error('Unexpected error on PostgreSQL pool:', err);
});
const query = (text, params) => {
    return pool.query(text, params);
};
exports.query = query;
exports.default = pool;

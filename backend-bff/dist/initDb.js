"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./db"));
async function initializeDatabase() {
    const schemaPath = path_1.default.join(__dirname, 'schema.sql');
    try {
        const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf8');
        let retries = 5;
        while (retries > 0) {
            try {
                await db_1.default.query(schemaSql);
                console.log('PostgreSQL database schema initialized successfully!');
                return;
            }
            catch (error) {
                retries--;
                console.error(`Failed to initialize database schema (retries left: ${retries}):`, error.message);
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
                else {
                    throw error;
                }
            }
        }
    }
    catch (error) {
        console.error('Critical database initialization failure:', error);
    }
}

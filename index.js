// Import and require packages
//const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

/*const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
*/

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_manager_db'
    },
    console.log(`Connected to the employee_manager_db database.`)
);
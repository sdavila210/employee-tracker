// Import and require packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');

// Connect to my sql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'PASSWORD WAS FILLED IN FOR DEMO VIDEO',
        database: 'employee_manager_db'
    },
    console.log(`Connected to the employee_manager_db database.`)
);

// Function that lists main menu options using a promise
function employeeManager() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee',
            'Exit'
        ]
    }).then(answer => {
        // Performs different actions based on user input
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee':
                updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Have a good day. Goodbye.');
                process.exit(0);
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Function to view list of all departments in a table
function viewAllDepartments() {
    db.query('SELECT * FROM department', (error, results) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.table(results);
        employeeManager();
    });
}

// Function to view list of all the roles in a table
function viewAllRoles() {
    db.query('SELECT * FROM role', (error, results) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.table(results);
        employeeManager();
    });
}
// Function to view list of all employees including their title, salary, and manager
function viewAllEmployees() {
    // Reads the SQL query from the query.sql file & displays result in a table
    fs.readFile('db/query.sql', 'utf8', (error, data) => {
        db.query(data, (error, results) => {
            if (error) {
                console.error('Error:', error);
                return;
            }
            console.table(results);
            employeeManager();
        });
    });
}

// Runs the function & initialize the employee manager/database
employeeManager();

// Function to add a department using inquirer to prompt user to enter details
function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answers => {
        db.query('INSERT INTO department (department_name) VALUES (?)', [answers.departmentName], (error, result) => {
            if (error) {
                console.error('Error adding department:', error);
                return;
            }
            console.log('Department added successfully!');
            employeeManager();
        });
    });
};

// Function to add a role using inquirer to prompt user to enter role details
function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:'
        },
        {
            name: 'salary',
            type: 'number',
            message: 'Enter the salary for the role:'
        },
        {
            name: 'department',
            type: 'input',
            message: 'Enter the department for the role:'
        }
    ]).then(answers => {
        // Get the department ID based on the department name entered by the user
        db.query('SELECT id FROM department WHERE department_name = ?', [answers.department], (error, results) => {
            if (error) {
                console.error('There was an error getting department ID:', error);
                return;
            }
            // If department not found, display an error message
            if (results.length === 0) {
                console.error('Department not found.');
                return;
            }
            // Get department ID from the results and insert the new role into the database
            const departmentId = results[0].id;
            db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, departmentId], (error, result) => {
                if (error) {
                    console.error('Error adding role:', error);
                    return;
                }
                console.log('Role added successfully!');
                employeeManager();
            });
        });
    });
}

// Function to add employee
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter employee first name:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter employee last name:'
        },
        {
            name: 'roleId',
            type: 'input',
            message: 'Enter the role ID for the employee:'
        }
    ]).then(function (answers) {
        // Retrieves user input
        const firstName = answers.firstName;
        const lastName = answers.lastName;
        const roleId = answers.roleId;

        // Inserts the new employee into the database
        db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [firstName, lastName, roleId], function (error, result) {
            if (error) {
                console.error('Error adding employee:', error);
                return;
            }
            console.log('Employee added successfully!');
            employeeManager();
        });
    });
}

// Function to update role
function updateEmployeeRole() {
    // Query the database to get the list of employees
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee', function (error, results) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        // Convert the results into an array of choices for inquirer
        const employeeChoices = results.map(employee => ({
            name: employee.full_name,
            value: employee.id
        }));
        // Prompt the user to select an employee to update
        inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: 'Select employee you want to update:',
                choices: employeeChoices
            },
            {
                name: 'roleId',
                type: 'input',
                message: 'Enter new role ID for employee:'
            }
        ]).then(function (answers) {
            // Retrieve user input & update role in database
            const employeeId = answers.employeeId;
            const roleId = answers.roleId;
            db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId], function (error, result) {
                if (error) {
                    console.error('Error updating role:', error);
                    return;
                }
                console.log('Employee role updated successfully!');
                return employeeManager();
            });
        });
    });
}
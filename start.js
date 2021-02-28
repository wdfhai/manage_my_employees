const fs = require ('fs');
const inquirer = require ('inquirer');
const mysql = require ('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Hiawatha6025',
    database: 'manageDB',
});

// const addDepartment = () => {};
// const addEmployee = () => {};
// const addRole = () => {};
// const viewAllEmployees = () => {};
// const viewByDepartment = () => {};
// const viewByRole = () => {};
// const updateRole = () => {};

// const updateManager = () => {};
// const viewByManager = () => {};
// const deleteDepartment = () => {};
// const deleteRole = () => {};
// const deleteEmployee = () => {};
// const viewBudget = () => {};

const greeting =
`        ___________________________________________________________________________________________
       |                                    MANAGE-MY-EMPLOYEES                                    |
       |___________________________________________________________________________________________|`;

const start = () => {
    console.clear();
    console.log(greeting);
    connection.end();
};

start();


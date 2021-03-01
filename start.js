require('dotenv').config();
const fs = require ('fs');
const inquirer = require ('inquirer');
const mysql = require ('mysql2');
const questions = require ('./questions');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'manageDB',
});

const addDepartment = () => {console.log("Adding department.")};
const addEmployee = () => {console.log("Adding employee.")};
const addRole = () => {console.log("Adding Role.")};
const viewAllEmployees = () => {
    console.log("Viewing All Employees");
    action();
};
const viewByDepartment = () => {console.log("Viewing Employees By Department")};
const viewByRole = () => {console.log("Viewing Employees By Role")};
const updateRole = () => {console.log("Updating Employee Role")};

const updateManager = () => {console.log("Updating Employee Manager")};
const viewByManager = () => {console.log("Viewing Employees By Manager")};
const removeDepartment = () => {console.log("Removing Department")};
const removeRole = () => {console.log("Removing Role")};
const removeEmployee = () => {console.log("Removing Employee")};
const viewBudget = () => {console.log("Viewing Company Budget")};

const greeting =
`        ___________________________________________________________________________________________
       |                                   "MANAGE MY EMPLOYEES"                                   |
       |___________________________________________________________________________________________|`;

const goodbye = 
`        ___________________________________________________________________________________________
       |                     Thank you for using Manage My Employees. Good bye!                    |
       |___________________________________________________________________________________________|`;

console.clear();
console.log(greeting);

// async function action() {
//     try {
//         const response = await inquirer.prompt(questions);
//         if (response.start === "EXIT") {
//             console.log(goodbye);
//             connection.end();
//         } else if (response.start === "View All Employees") {
//             viewAllEmployees();
//         } else if(response.start === "View Employees By Department") {
//             viewByDepartment();
//         } else if(response.start === "View Employees By Role") {
//             viewByRole();
//         } else if(response.start === "View Employees By Manager") {
//             viewByManager();
//         } else if(response.start === "Add Employee") {
//             addEmployee();
//         } else if(response.start === "Add Department") {
//             addDepartment();
//         } else if(response.start === "Add Role") {
//             addRole();
//         } else if(response.start === "Remove Employee") {
//             removeEmployee();
//         } else if(response.start === "Remove Department") {
//             removeDepartment();
//         } else if(response.start === "Remove Role") {
//             removeRole();
//         } else if(response.start === "Update Employee Role") {
//             updateRole();
//         } else if(response.start === "Update Employee Manager") {
//             updateManager();
//         } else if(response.start === "View Company Budget") {
//             viewBudget();
//         } else {
//             console.log("Action not recognized. Please choose again.");
//             action();
//         }
//         } catch (error) {
//         console.log(error);
//         console.log(errorDetected);
//         connection.end();
//         }
// };

const action = () => {
    inquirer
        .prompt(questions)
        .then((response) => {
            switch (response.start) {
            case "View All Employees":
                viewAllEmployees();
                break;
    
            case "View Employees By Department":
                viewByDepartment();
                break;
    
            case "View Employees By Role":
                viewByRole();
                break;
    
            case "View Employees By Manager":
                viewByManager();
                break;
    
            case "Add Employee":
                addEmployee();
                break;

            case "Add Department":
                addDepartment();
                break;

            case "Add Role":
                addRole();
                break;

            case "Remove Employee":
                removeEmployee();
                break;

            case "Remove Department":
                removeDepartment();
                break;  

            case "Remove Role":
                removeRole();
                break;

            case "Update Employee Role":
                updateRole();
                break;

            case "Update Employee Manager":
                updateManager();
                break;

            case "View Company Budget":
                viewBudget();
                break;

            case 'EXIT':
                console.log(goodbye);
                connection.end();
                break;
    
            default:
                console.log(`Invalid action: ${response.start}`);
                break;
            }
        });
    };

action();
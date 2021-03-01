require('dotenv').config({ path: './process.env' });
const fs = require ('fs');
const inquirer = require ('inquirer');
const InputPrompt = require('inquirer/lib/prompts/input');
const mysql = require ('mysql2');
const questions = require ('./questions');

const newEmployeeQuestions = [
    {
        name: 'role_id',
        type: 'list',
        message: "What will be the new employee's role? Select one.",
        choices: [1,2,3,4,5,6],
    },{
        name: 'first_name',
        type: 'input',
        message: "Enter employee's first name.",
    },{
        name: 'last_name',
        type: 'input',
        message: "Enter employee's last name.",
    }
];

const newRoleQuestions = [
    {
        name: 'new_role_department_id',
        type: 'list',
        message: 'Select the department to which the new role belongs.',
        choices: [1,2,3,4,5,6],
    },{
        name: 'new_role_title',
        type: 'input',
        message: 'What is the title of the new role?',
    },{
        name: 'new_role_salary',
        type: 'number',
        message: 'What is the salary of the new role?', 
    }
];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'manageDB',
});

const addDepartment = () => {console.log("Adding department.")};

const addEmployee = () => {
    console.log('Adding employee.')
    const query = 'SELECT department_id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;    
        console.table(res);
     await inquirer
        .prompt(newEmployeeQuestions)
        .then((answer) => {
            console.log(answer);
            const newEmployeeQuery = 'INSERT INTO employee (first_name, last_name, role_id) VALUES ("' + answer.first_name + '", "' + answer.last_name + '",' + answer.role_id + ')';
            connection.query(newEmployeeQuery, (err, res) => {
                if (err) throw (err);
                console.log('New Employee added');
                viewAllEmployees();
                action();
            });
        });
});
};

const addRole = () => {
    console.log('Adding Role.')
    let existingRoles;
    let roleQuery = 'SELECT * FROM role';
    connection.query(roleQuery, async (err,res) => {
        console.log(res);
        existingRoles = res.length;
        console.log(existingRoles);
    });
    let query = 'SELECT departments.id, department_name, title, salary FROM departments LEFT JOIN role ON departments.id = department_id';
    connection.query(query, async (err, res) => {
        if (err) throw err;    
        console.table(res);
    await inquirer
        .prompt(newRoleQuestions)
        .then((answer) => {
            let newRolesLength = existingRoles + 1;
            console.log(newRolesLength);
            const newRoleQuery = 'INSERT INTO role (id, title, salary, department_id) VALUES (' + newRolesLength + ', "'+ answer.new_role_title + '", ' + answer.new_role_salary + ',' + answer.new_role_department_id + ')';
            connection.query(newRoleQuery, (err, res) => {
                if (err) throw (err);
                console.log('New role added');
                action();
            });
        });
    });
};

const viewAllEmployees = () => {
    console.log("Viewing All Employees");
    let query = 'SELECT employee.id, first_name, last_name, title, department_name, salary FROM employee';
    query +=
    ' LEFT JOIN role ON role_id = department_id';
    query+=
    ' LEFT JOIN departments on role_id = departments.id ORDER BY role_id;';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
    action();
    });
    
};

const viewByDepartment = () => {
    console.log("Viewing Departments");
    let query = 'SELECT id, department_name FROM departments';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
    await inquirer
    .prompt({
      name: 'department',
      type: 'list',
      message: 'Select the department id you would like to view?',
      choices: [1,2,3,4,5,6],
    })
    .then((answer) => {
        connection.query(
            'SELECT employee.id, first_name, last_name, title, department_name, salary FROM employee LEFT JOIN role ON role_id = department_id LEFT JOIN departments on role_id = departments.id WHERE departments.id = ' + answer.department,
            (err,res) => {
            console.log("Viewing Employees By Department")
            console.table(res)
            action();
            }
            )
    })   
    })
};

const viewByRole = () => {
    console.log("Viewing Roles");
    let query = 'SELECT id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
    await inquirer
    .prompt({
      name: 'role',
      type: 'list',
      message: 'Select the role id you would like to view?',
      choices: [1,2,3,4,5,6],
    })
    .then((answer) => {
        connection.query(
            'SELECT employee.id, first_name, last_name, title, department_name, salary FROM employee LEFT JOIN role ON role_id = department_id LEFT JOIN departments on role_id = departments.id WHERE departments.id = ' + answer.role,
            (err,res) => {
            console.log("Viewing Employees By Department")
            console.table(res)
            action();
            }
            )
    })   
    })
};
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
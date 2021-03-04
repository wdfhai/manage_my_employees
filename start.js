require('dotenv').config({ path: './process.env' });
const fs = require ('fs');
const chalk = require ('chalk');
const emoji = require('node-emoji');
const inquirer = require ('inquirer');
const mysql = require ('mysql2');
const questions = require ('./questions');


let departmentIds = []
let roleArray = [];
let employeeArray = [];

const newEmployeeQuestions = [
    {
        name: 'role_id',
        type: 'list',
        message: "Select the role ID for the new employee.",
        choices: roleArray,
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
        message: 'Select the ID for the department the new role belongs.',
        choices: departmentIds,
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

const newDepartmentQuestions = [
    {
        name: 'new_department_name',
        type: 'input',
        message: 'Enter the name of the department you would like to add.'
    }
];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'manageDB',
});

const getRoleArray = (roleArray) => { 
    let query = 'SELECT id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        const populateRoleArray = res.map((role) => {
            roleArray.push(role.id);
        });
    });
}

const getEmployeeById = () => {
    let query = 'SELECT employee.id, first_name, last_name FROM employee';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const { employeeById } = await inquirer.prompt([{
            name: 'employeeById',
            message: 'Select employee by ID.',
            type: 'number',
        }]);
        const employeeQuery = 'DELETE FROM employee WHERE id = ' + employeeById;
        connection.query(employeeQuery, [{
            id: employeeById,
        }], async (err, res) => {
                if (err) throw err;
                if (!res.length) {
                    console.log('Please choose a valid id');
                } else {
                    console.log('employee record deleted');
                    action();
                };
    });
});
};

const getEmployeeByName = () => {
    let query = 'SELECT employee.id, first_name, last_name FROM employee';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const getEmployeeArray = res.map((employee)=>{
            console.log(employee.first_name, employee.last_name)
            employeeArray.push(employee.first_name + ' ' + employee.last_name);
        })
        console.log(employeeArray);
        const { employeeByName } = await inquirer.prompt([{
            name: 'employeeByName',
            message: 'Select employee.',
            type: 'list',
            choices: employeeArray,
        }]);
        console.log(res);
        const employeeQuery = `DELETE * FROM employee WHERE first_name = '${res.first_name}' AND last_name = '${employee.last_name}';`
        connection.query(employeeQuery, async (err, res) => {
                if (err) throw err;
                if (!res.length) {
                    console.log('Please choose a valid id');
                } else {
                    console.table(res)
                };
        })
    });
}

const addDepartment = () => {
    console.log("\nAdding department...\n")
    let query = 'SELECT id, department_name FROM departments';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        await inquirer
            .prompt(newDepartmentQuestions)
            .then ((answer) => {
                const newDepartmentQuery = 'INSERT INTO departments (department_name) VALUES ("' + answer.new_department_name + '")';
                connection.query(newDepartmentQuery, (err, res) => {
                    if (err) throw err;
                    console.log('New Department added.');
                    connection.query('SELECT * FROM departments', (err,res) => {
                        console.table(res);
                        action();
                    })
                })
            })
    })
};

const addEmployee = () => {
    getRoleArray(roleArray);
    console.log('\nAdding employee...\n')
    const query = 'SELECT role.id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;    
        console.table(res);
    await inquirer
        .prompt(newEmployeeQuestions)
        .then((answer) => {
            const newEmployeeQuery = 'INSERT INTO employee (first_name, last_name, role_id) VALUES ("' + answer.first_name + '", "' + answer.last_name + '",' + answer.role_id + ')';
            connection.query(newEmployeeQuery, (err, res) => {
                if (err) throw (err);
                console.log('\nNew Employee added!\n');
                // viewAllEmployees();
                action();
            });
        });
});
};

const addRole = () => {
    console.log('\nAdding Role...\n')
    let existingRoles;
    let roleQuery = 'SELECT * FROM departments';
    connection.query(roleQuery, async (err,res) => {
        const getDeptIds = res.map(function deptNames(dept) {
            departmentIds.push(dept.id)});
        console.log(departmentIds);
    });
    let query = 'SELECT departments.id, department_name, title, salary FROM departments LEFT JOIN role ON departments.id = department_id';
    connection.query(query, async (err, res) => {
        if (err) throw err;    
        console.table(res);
    await inquirer
        .prompt(newRoleQuestions)
        .then((answer) => {
            const newRoleQuery = 'INSERT INTO role (title, salary, department_id) VALUES ("'+ answer.new_role_title + '", ' + answer.new_role_salary + ',' + answer.new_role_department_id + ')';
            connection.query(newRoleQuery, (err, res) => {
                if (err) throw (err);
                console.log('\nNew role added!\n');
                action();
            });
        });
    });
};

const viewAllEmployees = () => {
    console.log("\nViewing All Employees\n");
    let query = 'SELECT employee.id, first_name, last_name, title, department_name, salary, manager_id FROM employee';
    query +=
    ' LEFT JOIN role ON role_id = department_id';
    query+=
    ' LEFT JOIN departments ON role_id = departments.id ORDER BY role_id;';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
    action();
    }); 
};

const viewByDepartment = () => {
    console.log("\nViewing Departments...\n");
    let query = 'SELECT id, department_name FROM departments';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const getDepartmentIds = res.map ((dept) => {
        departmentIds.push(dept.id);
        });
    await inquirer
    .prompt({
      name: 'department',
      type: 'list',
      message: 'Select the department id you would like to view?',
      choices: departmentIds,
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
    console.log("\nViewing Roles...\n");
    let query = 'SELECT id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        const getRoleArray = res.map((role) => {
            roleArray.push(role.title);
        })
        const { roleByTitle } = await inquirer.prompt({
            name: 'roleByTitle',
            message: 'Enter role to view.',
            type: 'list',
            choices: roleArray,
        });
        let roleQuery = 'SELECT employee.id, first_name, last_name, title FROM employee LEFT JOIN role ON role_id = role.id WHERE title = "' + roleByTitle + '"';
        connection.query(roleQuery, async (err, res) => {
                if (err) throw err;
                if (!res.length) {
                    console.log('\nPlease choose a valid title!\n');
                } else {
                    console.table(res)
                };
                action();
        });
    });
};

const updateRole = () => {
    console.log("\nUpdating Employee Role...\n")
    let query = 'SELECT employee.id, first_name, last_name, title, department_name, salary FROM employee';
    query +=
    ' LEFT JOIN role ON role_id = department_id';
    query+=
    ' LEFT JOIN departments ON role_id = departments.id ORDER BY role_id;';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const { employeeById, new_role } = await inquirer.prompt([{
            name: 'employeeById',
            message: 'Select employee by ID.',
            type: 'number',
        },{
            name: 'new_role',
            message: 'Enter the new role.',
            type: 'input',
        }]);
        const updateRoleQuery = 'UPDATE employee LEFT JOIN role ON role_id = department_id SET title = "?" WHERE employee.id = ?;';
        connection.query(updateRoleQuery, [new_role, employeeById], async (err, res) => {
                if (err) throw err;
                console.log(res);
                console.log('Employee role updated');
                action();
        });
    });
};





// const updateManager = () => {
//     console.log("\nUpdating Employee Manager...\n");
//     let query = 'SELECT employee.id, first_name, last_name, title, department_name, salary FROM employee';
//     query +=
//     ' LEFT JOIN role ON role_id = department_id';
//     query+=
//     ' LEFT JOIN departments ON role_id = departments.id ORDER BY role_id;';
//     connection.query(query, async (err, res) => {
//         if (err) throw err;
//         console.table(res);
//         const { employeeById, new_role } = await inquirer.prompt([{
//             name: 'employeeById',
//             message: 'Select employee by ID.',
//             type: 'number',
//         },{
//             name: 'new_manager',
//             message: 'Choose the new manager.',
//             type: 'list',
//             choices: employeeArray,
//         }]);
//         const updateRoleQuery = 'UPDATE employee LEFT JOIN role ON role_id = department_id SET title = "?" WHERE employee.id = ?;';
//         connection.query(updateRoleQuery, [new_role, employeeById], async (err, res) => {
//                 if (err) throw err;
//                 console.log(res);
//                 console.log('Employee role updated');
//                 action();
//         });
//     });
// };
const viewByManager = () => {console.log("\nViewing Employees By Manager\n")};

const removeDepartment = () => {console.log("\nRemoving Department...\n")
let query = 'SELECT employee.id, first_name, last_name FROM employee';
connection.query(query, async (err, res) => {
    if (err) throw err;
    console.table(res);
    const getEmployeeArray = res.map((employee)=>{
        console.log(employee.first_name, employee.last_name)
        employeeArray.push(employee.first_name + ' ' + employee.last_name);
    })
    console.log(employeeArray);
    const { employeeByName } = await inquirer.prompt([{
        name: 'employeeByName',
        message: 'Select employee.',
        type: 'list',
        choices: employeeArray,
    }]);
    console.log(res);
});
};

const removeRole = () => {console.log("Removing Role")};

const removeEmployee = () => {
    console.log("Removing Employee")
    let query = 'SELECT employee.id, first_name, last_name FROM employee';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const { employeeById } = await inquirer.prompt([{
            name: 'employeeById',
            message: 'Select employee by ID.',
            type: 'number',
        }]);
        const employeeQuery = 'DELETE FROM employee WHERE id = ' + employeeById;
        connection.query(employeeQuery, [{
            id: employeeById,
        }], async (err, res) => {
                if (err) throw err;
                console.log('Employee record deleted');
                action();
        });
    });
};

const viewBudget = () => {
    console.log("Viewing Company Budget")
    let query = 'SELECT employee.id, first_name, last_name, title, salary FROM employee';
    query +=
    ' LEFT JOIN role ON role_id = department_id';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        let salaryArray = [];
        const getSalaries = res.map((item)=>{
            salaryArray.push(parseInt(item.salary));
        })
        console.log('Total department budget is ',`${emoji.get('heavy_dollar_sign')}`, + salaryArray.reduce((a,b) => a+b) + '.');
    action();
    });
};

const greeting =
`


            ${emoji.get('male-office-worker')}  ${emoji.get('female-office-worker')}  ${emoji.get('male-technologist')}  ${chalk.bgMagenta('Manage My Employees')}  ${(emoji.get('female-technologist'))}  ${emoji.get('female-office-worker')} ${emoji.get('male-office-worker')}


`;

const goodbye = 
`

        ${emoji.get('white_check_mark')}    ${chalk.blueBright('Thank you for using Manage My Employees.')}     ${emoji.get('white_check_mark')}


`;

console.clear();
console.log(greeting);

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
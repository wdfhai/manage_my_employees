require('dotenv').config({ path: './process.env' });
const fs = require ('fs');
const chalk = require ('chalk');
const emoji = require('node-emoji');
const inquirer = require ('inquirer');
const mysql = require ('mysql2');
const questions = require ('./questions');

let departmentIds = [];
let departmentNames = []
let roleArray = [];
let employeeArray = [];
let empArray = [];
let deptArray = [];
let managerArray = [];

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
        choices: departmentNames,
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

const addDepartment = () => {
    console.clear();
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
    console.clear();
    console.log('\nAdding employee...\n')
    let query = 'SELECT id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        const populateRoleArray = res.map((role) => {
            const roleData = {
                name: role.title,
                value: role.id
            }
            roleArray.push(roleData);
        });
    await inquirer
        .prompt(newEmployeeQuestions)
        .then((answer) => {
            let manQuery = 'SELECT id, full_name FROM employee';
            connection.query(manQuery, async (err, res) => {
                if (err) throw err;
                let employeeIDArray = [];
                const getEmployeeArray = res.map((employee)=>{
                    const empManData = {
                        name: employee.full_name,
                        value: employee.id,
                    }
                    employeeIDArray.push(empManData);
                })
                await inquirer
                    .prompt({
                        name: 'managerById',
                        type: 'list',
                        message: "Select this employee's manager by ID.",
                        choices: employeeIDArray,
                    })
                    .then((manager) => {                    
                    const newEmployeeQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("' + answer.first_name + '", "' + answer.last_name + '",' + answer.role_id + ',' + manager.managerById + ')';
                    connection.query(newEmployeeQuery, (err, res) => {
                        if (err) throw (err);
                        console.log('\nNew Employee added!\n');
                        action();
                    });
                });
            });
        });
    });
};

const addRole = () => {
    console.clear();
    console.log('\nAdding Role...\n')
    let existingRoles;
    let roleQuery = 'SELECT * FROM departments';
    connection.query(roleQuery, async (err,res) => {
        const getDeptIds = res.map(function deptNames(dept) {
            const deptData = {
                name: dept.department_name,
                value: dept.id,
            }
            departmentNames.push(deptData)});
    });
    let query = 'SELECT departments.id, department_name, title, salary FROM departments LEFT JOIN role ON departments.id = department_id';
    connection.query(query, async (err, res) => {
        if (err) throw err;    
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
    console.clear();
    console.log("\nViewing All Employees\n");
    let query = 'SELECT employee.id, employee.full_name, role.title, role.salary, departments.department_name, employee2.full_name AS "manager" FROM employee LEFT JOIN employee AS employee2 ON employee.manager_id = employee2.id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN departments ON employee.role_id = departments.id';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
    action();
    }); 
};

const viewByDepartment = () => {
    console.clear();
    console.log("\nViewing Departments...\n");
    let query = 'SELECT id, department_name FROM departments';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        const getDepartmentIds = res.map ((dept) => {
            const deptData = {
                name: dept.department_name,
                value: dept.id,
            };
        departmentIds.push(deptData);
        });
    await inquirer
    .prompt({
        name: 'departmentID',
        type: 'list',
        message: 'Select the department you would like to view?',
        choices: departmentIds,
    })
    .then((answer) => {
        connection.query(
            'SELECT employee.id, full_name, title, department_name, salary FROM employee LEFT JOIN role ON role_id = department_id LEFT JOIN departments on role_id = departments.id WHERE departments.id = ' + answer.departmentID,
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
    console.clear();
    console.log("\nViewing Roles...\n");
    let query = 'SELECT id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        const getRoleArray = res.map((role) => {
            const roleData = {
                name: role.title,
                value: role.id,
            }
            roleArray.push(roleData);
        })
        await inquirer
        .prompt({
            name: 'roleID',
            message: 'Enter role to view.',
            type: 'list',
            choices: roleArray,
        })
        .then((answer) => {
            connection.query(
                'SELECT employee.id, full_name, title FROM employee LEFT JOIN role ON role_id = role.id WHERE role_id = ' + answer.roleID,
                (err,res) => {
                console.log("Viewing Employees By Department")
                console.table(res)
                action();
            })
        }) 
    });
};

const updateRole = () => {
    console.clear();
    console.log("\nUpdating Employee Role...\n")
    let query = 'SELECT employee.id, full_name, title, department_name, salary FROM employee';
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
                console.log('\nEmployee role updated.\n');
                action();
        });
    });
};





const updateManager = () => {
    console.clear();
    console.log("\nUpdating Employee Manager...\n");
    let query = 'SELECT employee.id, full_name FROM employee';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        const getEmployeeArray = res.map((employee)=>{
            const employeeData = {
                name: employee.full_name,
                value: employee.id,
            }
            employeeArray.push(employeeData);
        })
        await inquirer
        .prompt({
        name: 'employeeID',
        type: 'list',
        message: "Which employee's manager would you like to update?",
        choices: employeeArray,
        })
        .then((answer) => {
            let query = 'SELECT employee.id, full_name FROM employee';
            connection.query(query, async (err, res) => {
                if (err) throw err;
                let employeeArray2 = [];
                const getEmployeeArray2 = res.map((employee)=>{
                    const employeeData = {
                        name: employee.full_name,
                        value: employee.id,
                    }
                    employeeArray2.push(employeeData);
                });
                await inquirer
                .prompt({
                    name: 'managerID',
                    type: 'list',
                    message: 'Select the ID of the employee you would like to assign as manager',
                    choices: employeeArray2,
                })
                .then((ans)=>{
                    let query2 = 'UPDATE employee SET manager_id = ' + ans.managerID + ' WHERE employee.id = ' + answer.employeeID;
                    connection.query(query2, async (err,res) => {
                        console.log("\nEmployee manager updated.\n")
                        action();
                        })
                    })
                })
            }) 
        });
    }

const viewByManager = () => {
    console.clear();
    console.log("\nViewing Employees By Manager...\n");
    let query = 'SELECT employee.id, employee2.full_name AS "manager" FROM employee LEFT JOIN employee AS employee2 ON employee.manager_id = employee2.id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN departments ON employee.role_id = departments.id WHERE employee2.full_name IS NOT NULL';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        const getManagerArray = res.map((manager) => {
            managerArray.push(manager.manager);
        })
        if (!managerArray.length){
            console.log('\nLooks like no managers have been assigned at this time.\n')
            action();
        } else {
            await inquirer
            .prompt({
                name: 'managerById',
                message: 'Select the manager you would like to view.',
                type: 'list',
                choices: managerArray,
            })
            .then((answer) => {
                let managerQuery = 'SELECT employee.id, employee.full_name, employee2.full_name AS "manager", title FROM employee LEFT JOIN employee AS employee2 ON employee.manager_id = employee2.id LEFT JOIN role ON employee.role_id = role.id WHERE employee2.full_name = "' + answer.managerById + '"';
                connection.query(managerQuery, async (err, res) => {
                    if (err) throw err;
                    if (!res.length) {
                        console.log('\nPlease choose a valid name!\n');
                    } else {
                        console.table(res)
                    };
                    action();
                });
            });
        };
    });
};

const removeDepartment = () => {
    console.clear();
    console.log("\nRemoving Department and linked data...\n")
    let query = 'SELECT id, department_name FROM departments';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const getDeptArray = res.map((dept) => {
            deptArray.push(dept.id);
        })
        const { deptById } = await inquirer.prompt([{
            name: 'deptById',
            message: "Type in the ID of the department you would like to remove.",
            type: 'number',
        }]);
        if (!deptArray.includes(deptById)) {
            console.log('ID not found. Please try again.');
            removeDepartment();
        } else {
            const deptQuery = 'DELETE FROM departments WHERE id = ' + deptById;
            connection.query(deptQuery, async (err, res) => {
                    if (err) throw err;
                    console.log('\nDepartment record deleted!\n');
                    action();
            });
        };
    });
};

const removeRole = () => {
    console.clear();
    console.log("\nNow Removing Role and linked Salary data...\n");
    let query = 'SELECT id, title FROM role';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const getRoleArray = res.map((role) => {
            roleArray.push(role.id);
        })
        const { roleById } = await inquirer.prompt([{
            name: 'roleById',
            message: "Type in the ID of the Role you wish to remove.",
            type: 'number',
        }]);
        if (!roleArray.includes(roleById)) {
            console.log('\nID not found. Please try again.\n');
            removeRole();
        } else {
            const roleQuery = 'DELETE FROM role WHERE id = ' + roleById;
            connection.query(roleQuery, async (err, res) => {
                    if (err)throw err;
                    console.log('\nRole deleted!\n');
                    action();
            });
        };
    });
};

const removeEmployee = () => {
    console.clear();
    console.log("Now Removing Employee...")
    let query = 'SELECT employee.id, full_name FROM employee';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        console.table(res);
        const getEmpArray = res.map((emp) => {
            empArray.push(emp.id);
        })
        const { employeeById } = await inquirer.prompt([{
            name: 'employeeById',
            message: "Type in employee's ID.",
            type: 'number',
        }]);
        if (!empArray.includes(employeeById)) {
            console.log('ID not found. Please try again.');
            removeEmployee();
        } else {
            const employeeQuery = 'DELETE FROM employee WHERE id = ' + employeeById;
            connection.query(employeeQuery, [{
                id: employeeById,
            }], async (err, res) => {
                    if (err) {
                        console.log(`${emoji.get('exclamation')}`);
                        throw err};
                    console.log('Employee record deleted');
                    action();
            });
        };
    });
};

const viewBudget = () => {
    console.clear();
    console.log("\nViewing Company Budget...")
    let query = 'SELECT employee.id, full_name, title, salary FROM employee';
    query +=
    ' LEFT JOIN role ON role_id = department_id';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        let salaryArray = [];
        const getSalaries = res.map((item)=>{
            salaryArray.push((parseInt(item.salary)) || 0);
        })
        console.log('\nYour total company budget is $' + salaryArray.reduce((a,b) => a+b) + '.\n');
    action();
    });
};

const greeting =
`


            ${emoji.get('male-office-worker')}  ${emoji.get('female-judge')}  ${emoji.get('male-technologist')}  ${chalk.bgBlue('Manage My Employees')}  ${(emoji.get('female-doctor'))}  ${emoji.get('female-office-worker')}  ${emoji.get('male-construction-worker')}


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
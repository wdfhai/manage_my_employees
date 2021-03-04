const actions = [
    "View All Employees",
    "View Employees By Department",
    "View Employees By Role",
    "View Employees By Manager",
    "Add Employee",
    "Add Department",
    "Add Role",
    "Update Employee Role",
    "Update Employee Manager",
    "Remove Employee",
    "Remove Department",
    "Remove Role",
    "View Company Budget",
    "EXIT",
];

const questions = [
    {
        name: 'start',
        message: '\nWhat would you like to do? \n',
        type: 'list',
        choices: actions,
    }
];

module.exports = questions;
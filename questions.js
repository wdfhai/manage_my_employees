const actions = [
    "View All Employees",
    "View Company Budget",
    "View Employees By Department",
    "View Employees By Role",
    "View Employees By Manager",
    "Add Employee",
    "Add Department",
    "Add Role",
    "Update Employee Role",
    "Update Employee Manager",
    "Remove Employee",
    "Remove Role",
    "Remove Department",
    "EXIT",
];

const questions = [
    {
        name: 'start',
        message: 'What would you like to do?\n',
        type: 'list',
        choices: actions,
    }
];

module.exports = questions;
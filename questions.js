const actions = [
    "View All Employees",
    "View Employees By Department",
    "View Employees By Role",
    "View Employees By Manager",
    "Add Employee",
    "Add Department",
    "Add Role",
    "Remove Employee",
    "Remove Department",
    "Remove Role",
    "Update Employee Role",
    "Update Employee Manager",
    "View Company Budget",
    "EXIT",
];

const questions = [
    {
        name: 'start',
        message: 'What would you like to do?',
        type: 'list',
        choices: actions,
    }
];

module.exports = questions;
DROP DATABASE IF EXISTS manageDB;

CREATE DATABASE manageDB;

USE manageDB;

CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR (30) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR (30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(department_id) REFERENCES departments(id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY(id),
FOREIGN KEY(manager_id) REFERENCES employee(id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Michael", "Scott", 1), ("Dwight", "Schrute", 2), ("Jim", "Halpert", 2), ("Stanley", "Hudson", 2),("Phyllis", "Vance", 2), ("Oscar", "Martinez", 3), ("Angela", "Martin", 3), ("Kevin", "Malone", 3), ("Creed", "Bratton", 4), ("Kelly", "Kapoor", 5),("Toby", "Flenderson", 6);

INSERT INTO departments (department_name)
VALUES ("Management"), ("Sales"), ("Accounting"), ("Quality Assurance"), ("Customer Service"), ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1), ("Salesperson", 80000, 2), ("Accountant", 50000, 3), ("Inspector", 55000, 4), ("CS Representative", 30000, 5),("HR Representative", 45000, 6);

SELECT * FROM employee;

SELECT employee.id, first_name, last_name, title, department_name, salary, manager_id
FROM employee 
LEFT JOIN role ON role_id = department_id 
LEFT JOIN departments on role_id = departments.id;

SELECT employee.id, first_name, last_name, title, salary 
FROM employee 
LEFT JOIN role ON role_id = department_id
LEFT JOIN departments ON role_id = departments.id
WHERE departments.id = 4;

SELECT employee.id, first_name, last_name, title, department_name, salary FROM employee
LEFT JOIN role ON role_id = department_id
LEFT JOIN departments ON role_id = departments.id
WHERE role.id = 2;

SELECT employee.id, first_name, last_name FROM employee WHERE first_name last_name = 'dwight schrute';

UPDATE employee
LEFT JOIN role ON role_id = department_id
SET title = 'happy' WHERE employee.id = 4;
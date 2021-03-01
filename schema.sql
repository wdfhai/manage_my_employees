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
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY(id)
-- FOREIGN KEY(role_id) REFERENCES role(id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Michael", "Scott", 1), ("Dwight", "Schrute", 2), ("Jim", "Halpert", 2), ("Oscar", "Martinez", 3), ("Creed", "Bratton", 4), ("Kelly", "Kapoor", 5),("Toby", "Flenderson", 6);

INSERT INTO departments (department_name)
VALUES ("Management"), ("Sales"), ("Accounting"), ("Quality Assurance"), ("Customer Service"), ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1), ("Salesman", 80000, 2), ("Accountant", 50000, 3), ("Inspector", 55000, 4), ("Service Representative", 30000, 5),("HR Representative", 45000, 6);


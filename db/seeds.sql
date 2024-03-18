INSERT INTO department (department_name)
VALUES  (1, 'Engineering'),
        (2, 'Finance'),
        (3, 'Legal'),
        (4, 'Sales'),
        (5, 'Customer Service');

INSERT INTO role (title, salary, department_id)
VALUES  ('Software Engineer', 125000, 001),
        ('Accountant', 100000, 002),
        ('Lawyer', 150000, 003),
        ('Sales Consultant', 80000, 004),
        ('Customer Service Rep', 65000, 005)
        ('Call Center Rep', 65000, 005);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1, 01),
        ('Mike', 'Chan', 2, 02),
        ('Ted', 'Smith', 3, NULL),
        ('Ashley', 'Moore', 4, 03),
        ('Sarah', 'Perez', 5, 04),
        ('Mary', 'Lou', 6, 04);

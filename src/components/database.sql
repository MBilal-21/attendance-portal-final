-- ============================================
-- UNIVERSITY ATTENDANCE SYSTEM DATABASE
-- ============================================

CREATE DATABASE IF NOT EXISTS attendance_portal;
USE attendance_portal;

-- ============================
-- 1. USERS TABLE (Admin, Teacher, Student)
-- ============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- 2. PROGRAMS (BSIT, BSCS, MSIT, etc.)
-- ============================
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(50) NOT NULL
);

-- ============================
-- 3. CLASSES
-- ============================
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    semester INT NOT NULL,
    section ENUM('Regular', 'Self Support 1', 'Self Support 2') NOT NULL,
    intake ENUM('Yes', 'No') DEFAULT 'No',
    start_year YEAR NOT NULL,

    FOREIGN KEY (program_id) REFERENCES programs(id)
        ON DELETE CASCADE
);

-- ============================
-- 4. SUBJECTS
-- ============================
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE NOT NULL
);

-- ============================
-- 5. CLASS - SUBJECT ASSIGNMENT
-- ============================
CREATE TABLE class_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,

    FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
        ON DELETE CASCADE
);

-- ============================
-- 6. TEACHER ASSIGNMENT 
-- Teacher teaches a subject to a class
-- ============================
CREATE TABLE teacher_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,

    FOREIGN KEY (teacher_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
        ON DELETE CASCADE
);

-- ============================
-- 7. STUDENTS TABLE
-- Contains student profile & class
-- ============================
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    roll_no VARCHAR(50) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE
);

-- ============================
-- 8. ATTENDANCE 
-- Teacher marks attendance for each student
-- ============================
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    marked_by_teacher INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,

    FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
        ON DELETE CASCADE,
    FOREIGN KEY (marked_by_teacher) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

INSERT INTO programs (program_name) VALUES
('BSIT'), ('BSCS'), ('MSIT'), ('Bachelor of Science in Computer Science');


INSERT INTO classes (program_id, semester, section, intake, start_year) VALUES
(1, 1, 'Regular', 'Yes', 2024),
(2, 1, 'Regular', 'Yes', 2024),
(3, 1, 'Regular', 'Yes', 2024);

INSERT INTO subjects (subject_name, subject_code) VALUES
('Database Systems', 'DBS101'),
('Operating Systems', 'OS201'),
('Data Structures', 'DS301');


-- Add more sample data as needed

-- ============================================
INSERT INTO users (name, email, password, role) VALUES

-- ========== CLASS 1 ==========
('Admin Bee', 'admin@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'admin'),
('Student 1A', 'student1a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 2A', 'student2a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 3A', 'student3a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 4A', 'student4a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 5A', 'student5a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 6A', 'student6a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 7A', 'student7a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 8A', 'student8a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 9A', 'student9a@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 10A','student10a@uni.com','$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),

-- ========== CLASS 2 ==========
('Student 1B', 'student1b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 2B', 'student2b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 3B', 'student3b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 4B', 'student4b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 5B', 'student5b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 6B', 'student6b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 7B', 'student7b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 8B', 'student8b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 9B', 'student9b@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 10B','student10b@uni.com','$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),

-- ========== CLASS 3 ==========
('Student 1C', 'student1c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 2C', 'student2c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 3C', 'student3c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 4C', 'student4c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 5C', 'student5c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 6C', 'student6c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 7C', 'student7c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 8C', 'student8c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 9C', 'student9c@uni.com', '$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student'),
('Student 10C','student10c@uni.com','$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva', 'student');


-- ---
INSERT INTO students (user_id, class_id, roll_no)
SELECT id, 1, CONCAT('BSIT-', id)
FROM users
WHERE email IN (
'student1a@uni.com',
'student2a@uni.com',
'student3a@uni.com',
'student4a@uni.com',
'student5a@uni.com',
'student6a@uni.com',
'student7a@uni.com',
'student8a@uni.com',
'student9a@uni.com',
'student10a@uni.com'
);

---
INSERT INTO students (user_id, class_id, roll_no)
SELECT id, 2, CONCAT('BSCS-', id)
FROM users
WHERE email IN (
'student1b@uni.com',
'student2b@uni.com',
'student3b@uni.com',
'student4b@uni.com',
'student5b@uni.com',
'student6b@uni.com',
'student7b@uni.com',
'student8b@uni.com',
'student9b@uni.com',
'student10b@uni.com'
);
--
INSERT INTO students (user_id, class_id, roll_no)
SELECT id, 3, CONCAT('MSIT-', id)
FROM users
WHERE email IN (
'student1c@uni.com',
'student2c@uni.com',
'student3c@uni.com',
'student4c@uni.com',
'student5c@uni.com',
'student6c@uni.com',
'student7c@uni.com',
'student8c@uni.com',
'student9c@uni.com',
'student10c@uni.com'
);
-- ============================================
INSERT INTO users (name,email,password,role) VALUES
('Sir Ahmed','ahmed@uni.com','$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva','teacher'),
('Miss Ayesha','ayesha@uni.com','$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva','teacher'),
('Sir Bilal','bilal@uni.com','$2a$10$TN9vxx98i7bsE.qLWWZPm.mdCUqbVvDvJGQ0TKZB6hLaMOO0k2cva','teacher');
-- ============================================
INSERT INTO teacher_assignments (teacher_id, class_id, subject_id)
VALUES
((SELECT id FROM users WHERE email='ahmed@uni.com'), 1, 1),
((SELECT id FROM users WHERE email='ayesha@uni.com'), 2, 2),
((SELECT id FROM users WHERE email='bilal@uni.com'), 3, 3);
-- ============================================
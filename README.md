# Smart Hospital Management & Appointment System

A web-based hospital management system developed using **Java, Spring Boot, Spring Security, Spring Data JPA, MySQL, JSP, HTML, CSS, and JavaScript**.

## Features

* Secure user registration and login
* Patient management
* Doctor management
* Appointment booking and management
* Medical record management
* Hospital dashboard
* RESTful APIs
* BCrypt password encryption
* MySQL database integration

## Tech Stack

**Backend:** Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate

**Frontend:** JSP, HTML, CSS, JavaScript

**Database:** MySQL

**Tools:** Maven, Git, GitHub, Postman

## Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL Database
```

## Modules

* **User** – Registration, login and authentication
* **Patient** – Add, view, update and delete patients
* **Doctor** – Manage doctor details
* **Appointment** – Book and manage appointments
* **Medical Records** – Manage patient medical records

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-hospital-management.git
cd smart-hospital-management
```

### 2. Create MySQL Database

```sql
CREATE DATABASE hospital_db;
```

### 3. Configure Database

Update your MySQL username and password in:

```text
src/main/resources/application.properties
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

Open:

```text
http://localhost:8080/login
```



B.Tech – Computer Science and Technology

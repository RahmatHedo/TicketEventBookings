CREATE DATABASE IF NOT EXISTS event_ticketing;
USE event_ticketing;


CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('organizer','customer'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id_event INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  title VARCHAR(150),
  description TEXT,
  date DATE,
  location VARCHAR(150),
  capacity INT,
  available_tickets INT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE bookings (
  id_booking INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  id_event INT NOT NULL,
  quantity INT,
  price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  status ENUM('pending','confirmed','cancelled'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id_user),
  FOREIGN KEY (id_event) REFERENCES events(id_event)
);

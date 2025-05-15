-- AgendAI - Sistema de Agendamento Inteligente
-- Script de criação do banco de dados

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS agendai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agendai;

-- Tabela de usuários (administradores e usuários das empresas)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'company_admin', 'company_staff') NOT NULL,
    company_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    avatar_url VARCHAR(255) NULL,
    INDEX(email),
    INDEX(company_id)
);

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    document_number VARCHAR(20) NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    address JSON NULL,
    payment_status ENUM('active', 'pending', 'overdue', 'canceled') DEFAULT 'active',
    settings JSON NULL,
    business_hours JSON NULL,
    working_days JSON NULL,
    logo_url VARCHAR(255) NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(email)
);

-- Adicionar chave estrangeira na tabela users
ALTER TABLE users ADD CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- Tabela de clientes (clientes das empresas que usam o sistema)
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NOT NULL,
    document_number VARCHAR(20) NULL,
    address JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX(email),
    INDEX(phone),
    INDEX(company_id),
    UNIQUE(company_id, phone)
);

-- Tabela de profissionais (prestadores de serviço das empresas)
CREATE TABLE IF NOT EXISTS professionals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    specialization VARCHAR(100) NULL,
    bio TEXT NULL,
    working_hours JSON NULL,
    working_days JSON NULL,
    avatar_url VARCHAR(255) NULL,
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'on_vacation') DEFAULT 'active',
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX(company_id)
);

-- Tabela de serviços oferecidos
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    duration INT NOT NULL COMMENT 'Duração em minutos',
    price DECIMAL(10,2) NOT NULL,
    color VARCHAR(7) NULL COMMENT 'Cor hexadecimal para o calendário',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX(company_id)
);

-- Tabela de relação entre profissionais e serviços
CREATE TABLE IF NOT EXISTS professional_services (
    professional_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (professional_id, service_id),
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    client_id INT NOT NULL,
    professional_id INT NOT NULL,
    service_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('scheduled', 'confirmed', 'completed', 'canceled', 'no_show') DEFAULT 'scheduled',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded', 'canceled') DEFAULT 'pending',
    price DECIMAL(10,2) NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX(company_id),
    INDEX(client_id),
    INDEX(professional_id),
    INDEX(date),
    INDEX(status)
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    company_id INT NULL,
    appointment_id INT NULL,
    type ENUM('appointment_reminder', 'appointment_confirmation', 'appointment_cancellation', 'system_message', 'payment_confirmation') NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    INDEX(user_id),
    INDEX(company_id),
    INDEX(is_read)
);

-- Inserir administrador padrão
INSERT INTO users (name, email, password, role)
VALUES ('Administrador', 'admin@agendai.com', '$2a$12$1InE4AsCWtOkOYe5jmd6G.ex2MKT4w7KvIDOQd9jdT6EfFsNpkF4W', 'admin');
-- Senha: admin (criptografada com bcrypt)

-- Inserir empresa de demonstração
INSERT INTO companies (name, document_number, email, phone, address, payment_status, business_hours, working_days)
VALUES (
    'Empresa Demonstração',
    '12.345.678/0001-99',
    'empresa@agendai.com',
    '(11) 99999-9999',
    '{"street": "Rua Exemplo", "number": "123", "neighborhood": "Centro", "city": "São Paulo", "state": "SP", "zipcode": "01234-567"}',
    'active',
    '{"start": "09:00", "end": "18:00", "lunch_start": "12:00", "lunch_end": "13:00"}',
    '[1, 2, 3, 4, 5]'
);

-- Inserir usuário para empresa de demonstração
INSERT INTO users (name, email, password, role, company_id)
VALUES ('Gerente Empresa', 'empresa@agendai.com', '$2a$12$3eI2ISD3l5HQluLhRr5fFOK6NT5Oi6q1CHsIoRiB0/u6xO/b/JiG.', 'company_admin', 1);
-- Senha: empresa (criptografada com bcrypt)

-- Inserir profissionais de demonstração para a empresa
INSERT INTO professionals (company_id, name, email, phone, specialization, working_hours, working_days, status)
VALUES
(1, 'João Silva', 'joao@exemplo.com', '(11) 98765-4321', 'Cabeleireiro', '{"start": "09:00", "end": "18:00"}', '[1, 2, 3, 4, 5]', 'active'),
(1, 'Maria Oliveira', 'maria@exemplo.com', '(11) 91234-5678', 'Manicure', '{"start": "09:00", "end": "18:00"}', '[1, 3, 5]', 'active'),
(1, 'Carlos Santos', 'carlos@exemplo.com', '(11) 99876-5432', 'Barbeiro', '{"start": "10:00", "end": "19:00"}', '[2, 4, 6]', 'active');

-- Inserir serviços de demonstração
INSERT INTO services (company_id, name, description, duration, price, color, status)
VALUES
(1, 'Corte de Cabelo', 'Corte masculino ou feminino', 30, 50.00, '#3a86ff', 'active'),
(1, 'Manicure', 'Tratamento de unhas', 45, 35.00, '#8338ec', 'active'),
(1, 'Pedicure', 'Tratamento de unhas dos pés', 60, 45.00, '#ff006e', 'active'),
(1, 'Barba', 'Barba profissional', 20, 30.00, '#fb5607', 'active'),
(1, 'Coloração', 'Pintura de cabelo', 90, 120.00, '#ffbe0b', 'active');

-- Relação entre profissionais e serviços
INSERT INTO professional_services (professional_id, service_id)
VALUES
(1, 1), -- João: Corte de Cabelo
(1, 5), -- João: Coloração
(2, 2), -- Maria: Manicure
(2, 3), -- Maria: Pedicure
(3, 1), -- Carlos: Corte de Cabelo
(3, 4); -- Carlos: Barba

-- Inserir clientes de demonstração
INSERT INTO clients (company_id, name, email, phone, document_number, status)
VALUES
(1, 'Ana Souza', 'ana@exemplo.com', '(11) 91111-2222', '123.456.789-01', 'active'),
(1, 'Pedro Mendes', 'pedro@exemplo.com', '(11) 93333-4444', '987.654.321-09', 'active'),
(1, 'Lucia Ferreira', 'lucia@exemplo.com', '(11) 95555-6666', '456.789.123-45', 'active'),
(1, 'Roberto Alves', 'roberto@exemplo.com', '(11) 97777-8888', '789.123.456-78', 'active');

-- Inserir agendamentos de demonstração (passados e futuros)
INSERT INTO appointments (company_id, client_id, professional_id, service_id, date, start_time, end_time, status, payment_status, price)
VALUES
-- Agendamentos passados
(1, 1, 1, 1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '10:00:00', '10:30:00', 'completed', 'paid', 50.00),
(1, 2, 3, 4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '14:00:00', '14:20:00', 'completed', 'paid', 30.00),
(1, 3, 2, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '11:00:00', '11:45:00', 'completed', 'paid', 35.00),
(1, 4, 1, 5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '15:00:00', '16:30:00', 'completed', 'paid', 120.00),
-- Agendamentos para hoje
(1, 1, 3, 1, CURDATE(), '09:00:00', '09:30:00', 'confirmed', 'pending', 50.00),
(1, 2, 2, 3, CURDATE(), '13:00:00', '14:00:00', 'confirmed', 'pending', 45.00),
-- Agendamentos futuros
(1, 3, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', '11:30:00', 'scheduled', 'pending', 50.00),
(1, 4, 3, 4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', '16:20:00', 'scheduled', 'pending', 30.00),
(1, 1, 2, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '10:45:00', 'scheduled', 'pending', 35.00),
(1, 2, 1, 5, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00:00', '15:30:00', 'scheduled', 'pending', 120.00); 
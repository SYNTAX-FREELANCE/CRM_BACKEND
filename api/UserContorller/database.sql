CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_name VARCHAR(200) NOT NULL,

    mobile_number_1 VARCHAR(15) NOT NULL,

    mobile_number_2 VARCHAR(15),

    email VARCHAR(200),

    address TEXT,

    city VARCHAR(100),

    district VARCHAR(100),

    state VARCHAR(100),

    pincode VARCHAR(20),

    is_active TINYINT(1) DEFAULT 1,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
    REFERENCES users_master(user_id)
);



CREATE TABLE vehicle_types (
    vehicle_type_id INT AUTO_INCREMENT PRIMARY KEY,

    vehicle_type_name VARCHAR(100) NOT NULL,

    is_active TINYINT(1) DEFAULT 1
);


CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    registration_number VARCHAR(50) NOT NULL UNIQUE,

    vehicle_type_id INT,

    make VARCHAR(100),

    model VARCHAR(100),

    manufacture_year YEAR,

    engine_number VARCHAR(100),

    chassis_number VARCHAR(100),

    is_active TINYINT(1) DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id),

    FOREIGN KEY (vehicle_type_id)
    REFERENCES vehicle_types(vehicle_type_id)
);

CREATE TABLE insurance_companies (
    insurance_company_id INT AUTO_INCREMENT PRIMARY KEY,

    company_name VARCHAR(200) NOT NULL,

    contact_number VARCHAR(20),

    email VARCHAR(200),

    is_active TINYINT(1) DEFAULT 1
);


CREATE TABLE policies (
    policy_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    insurance_company_id INT NOT NULL,

    policy_number VARCHAR(100) NOT NULL,

    policy_type VARCHAR(100),

    renewal_year YEAR NOT NULL,

    renewal_cycle INT DEFAULT 1,

    previous_policy_id INT NULL,

    start_date DATE NOT NULL,

    expiry_date DATE NOT NULL,

    premium_amount DECIMAL(12,2) DEFAULT 0.00,

    insured_declared_value DECIMAL(12,2) DEFAULT 0.00,

    reminder_days INT DEFAULT 30,

    policy_status ENUM(
        'ACTIVE',
        'EXPIRED',
        'RENEWED',
        'CANCELLED'
    ) DEFAULT 'ACTIVE',

    remarks TEXT,

    is_active TINYINT(1) DEFAULT 1,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_policy_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id),

    CONSTRAINT fk_policy_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id),

    CONSTRAINT fk_policy_company
        FOREIGN KEY (insurance_company_id)
        REFERENCES insurance_companies(insurance_company_id),

    CONSTRAINT fk_policy_created_by
        FOREIGN KEY (created_by)
        REFERENCES users_master(user_id),

    CONSTRAINT fk_previous_policy
        FOREIGN KEY (previous_policy_id)
        REFERENCES policies(policy_id)
);


CREATE TABLE lead_status_master (
    status_id INT AUTO_INCREMENT PRIMARY KEY,

    status_name VARCHAR(100),

    display_order INT,

    is_active TINYINT(1) DEFAULT 1
);


CREATE TABLE leads (
    lead_id INT AUTO_INCREMENT PRIMARY KEY,

    policy_id INT NOT NULL,

    status_id INT DEFAULT 1,

    assigned_to INT NULL,

    assigned_date DATETIME NULL,

    is_assigned TINYINT(1) DEFAULT 0,

    lead_source VARCHAR(100),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (policy_id)
    REFERENCES policies(policy_id),

    FOREIGN KEY (status_id)
    REFERENCES lead_status_master(status_id),

    FOREIGN KEY (assigned_to)
    REFERENCES users_master(user_id)
);


CREATE TABLE lead_assignment_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,

    lead_id INT NOT NULL,

    old_user_id INT,

    new_user_id INT,

    assigned_by INT,

    remarks TEXT,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lead_id)
    REFERENCES leads(lead_id),

    FOREIGN KEY (old_user_id)
    REFERENCES users_master(user_id),

    FOREIGN KEY (new_user_id)
    REFERENCES users_master(user_id),

    FOREIGN KEY (assigned_by)
    REFERENCES users_master(user_id)
);


CREATE TABLE lead_followups (
    followup_id INT AUTO_INCREMENT PRIMARY KEY,

    lead_id INT NOT NULL,

    status_id INT NOT NULL,

    remarks TEXT,

    next_followup_date DATE,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lead_id)
    REFERENCES leads(lead_id),

    FOREIGN KEY (status_id)
    REFERENCES lead_status_master(status_id),

    FOREIGN KEY (created_by)
    REFERENCES users_master(user_id)
);


CREATE TABLE quotes (
    quote_id INT AUTO_INCREMENT PRIMARY KEY,

    lead_id INT NOT NULL,

    insurance_company_id INT NOT NULL,

    premium_amount DECIMAL(12,2),

    valid_till DATE,

    remarks TEXT,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lead_id)
    REFERENCES leads(lead_id),

    FOREIGN KEY (insurance_company_id)
    REFERENCES insurance_companies(insurance_company_id),

    FOREIGN KEY (created_by)
    REFERENCES users_master(user_id)
);



CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,

    lead_id INT NOT NULL,

    appointment_date DATETIME,

    location VARCHAR(255),

    remarks TEXT,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lead_id)
    REFERENCES leads(lead_id),

    FOREIGN KEY (created_by)
    REFERENCES users_master(user_id)
);


-- ========================================
-- ORGANIZATION TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'Construction and infrastructure nonprofit organization.', 'contact@brightfuture.org', 'brightfuture.png'),
('GreenHarvest Growers', 'Urban agriculture and sustainability organization.', 'info@greenharvest.org', 'greenharvest.png'),
('UnityServe Volunteers', 'Community volunteer and outreach organization.', 'hello@unityserve.org', 'unityserve.png');

-- ========================================
-- PROJECT TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
);

-- (project inserts unchanged — kept for your dataset)

-- ========================================
-- CATEGORY TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- PROJECT_CATEGORY TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

INSERT INTO category (name)
VALUES
    ('Environmental Cleanup'),
    ('Food Assistance'),
    ('Community Outreach')
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- ROLES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;

-- ========================================
-- USERS TABLE (FIXED)
-- ========================================

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    role_id INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
);

-- ========================================
-- SAFE TEST USER (OPTIONAL)
-- ========================================

INSERT INTO users (name, email, password_hash, role_id)
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- IMPORTANT FIX: USER QUERY PATTERN
-- (Use this in your authenticateUser model)
-- ========================================

-- ALWAYS USE THIS STRUCTURE:
-- SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
-- FROM users u
-- JOIN roles r ON u.role_id = r.role_id
-- WHERE u.email = $1;

-- ========================================
-- VERIFY JOIN
-- ========================================

SELECT
    u.user_id,
    u.name,
    u.email,
    r.role_name,
    r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;
-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'Construction and infrastructure nonprofit organization.',
    'contact@brightfuture.org',
    'brightfuture.png'
),
(
    'GreenHarvest Growers',
    'Urban agriculture and sustainability organization.',
    'info@greenharvest.org',
    'greenharvest.png'
),
(
    'UnityServe Volunteers',
    'Community volunteer and outreach organization.',
    'hello@unityserve.org',
    'unityserve.png'
);

-- ========================================
-- Project Table
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
-- ========================================
-- Insert Project Data
-- ========================================

INSERT INTO project (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES

-- ========================================
-- BrightFuture Builders (organization_id = 1)
-- ========================================

(
    1,
    'Community Center Renovation',
    'Renovating an aging community center using sustainable construction materials.',
    'Calgary, Alberta',
    '2026-06-15'
),
(
    1,
    'Affordable Housing Initiative',
    'Building affordable housing units for low-income families.',
    'Edmonton, Alberta',
    '2026-07-20'
),
(
    1,
    'Playground Restoration',
    'Restoring public playgrounds with safer and eco-friendly equipment.',
    'Red Deer, Alberta',
    '2026-08-10'
),
(
    1,
    'Bridge Safety Upgrade',
    'Upgrading pedestrian bridges to improve accessibility and safety.',
    'Lethbridge, Alberta',
    '2026-09-05'
),
(
    1,
    'Solar School Retrofit',
    'Installing solar panels and energy-efficient systems in schools.',
    'Medicine Hat, Alberta',
    '2026-10-01'
),

-- ========================================
-- GreenHarvest Growers (organization_id = 2)
-- ========================================

(
    2,
    'Downtown Rooftop Garden',
    'Creating rooftop gardens to promote urban agriculture.',
    'Calgary, Alberta',
    '2026-05-25'
),
(
    2,
    'Community Greenhouse Program',
    'Building greenhouses for year-round food production.',
    'Edmonton, Alberta',
    '2026-06-18'
),
(
    2,
    'School Garden Expansion',
    'Expanding educational gardens in elementary schools.',
    'Airdrie, Alberta',
    '2026-07-12'
),
(
    2,
    'Neighborhood Compost Initiative',
    'Launching a compost collection and education program.',
    'Okotoks, Alberta',
    '2026-08-08'
),
(
    2,
    'Urban Orchard Project',
    'Planting fruit trees in public spaces for community access.',
    'Banff, Alberta',
    '2026-09-14'
),

-- ========================================
-- UnityServe Volunteers (organization_id = 3)
-- ========================================

(
    3,
    'Winter Clothing Drive',
    'Organizing volunteers to distribute winter clothing to shelters.',
    'Calgary, Alberta',
    '2026-11-01'
),
(
    3,
    'Senior Support Visits',
    'Coordinating volunteers to assist isolated seniors.',
    'Edmonton, Alberta',
    '2026-06-30'
),
(
    3,
    'Food Bank Volunteer Campaign',
    'Recruiting volunteers for local food bank operations.',
    'Red Deer, Alberta',
    '2026-07-22'
),
(
    3,
    'Community Cleanup Day',
    'Hosting neighborhood cleanup and beautification events.',
    'Canmore, Alberta',
    '2026-08-16'
),
(
    3,
    'Back-to-School Supply Drive',
    'Collecting and distributing school supplies for children in need.',
    'Lethbridge, Alberta',
    '2026-09-03'
);
-- =========================================
-- CATEGORY TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================================
-- PROJECT_CATEGORY JUNCTION TABLE
-- =========================================

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

-- =========================================
-- INSERT CATEGORIES
-- =========================================

INSERT INTO category (name)
VALUES
    ('Environmental Cleanup'),
    ('Food Assistance'),
    ('Community Outreach')
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- ASSOCIATE PROJECTS WITH CATEGORIES
-- =========================================

-- Example associations
-- Change project IDs if your database uses different ones

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 1),
    (1, 3),
    (2, 2),
    (3, 3)
ON CONFLICT DO NOTHING;

-- Create roles table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- Insert initial roles
INSERT INTO roles (role_name, role_description) VALUES
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test user (optional for verification)
INSERT INTO users (name, email, password_hash, role_id)
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Verify relationship between tables
SELECT
    u.user_id,
    u.name,
    u.email,
    r.role_name,
    r.role_description
FROM users u
JOIN roles r
    ON u.role_id = r.role_id;

-- Remove test user after verification
DELETE FROM users
WHERE email = 'test@example.com';
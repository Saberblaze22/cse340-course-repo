import express from 'express';

import { showHomePage } from './controllers/index.js';

/* ---------------- ORGANIZATIONS ---------------- */
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

/* ---------------- PROJECTS ---------------- */
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';

/* ---------------- CATEGORIES ---------------- */
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';

/* ---------------- USERS ---------------- */
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/* ===================== HOME ===================== */
router.get('/', showHomePage);

/* ================= ORGANIZATIONS ================= */
router.get('/organizations', showOrganizationsPage);

router.get('/organization/:id', showOrganizationDetailsPage);

/* CREATE */
router.get(
    '/organizations/new',
    requireRole('admin'),
    showNewOrganizationForm
);

router.post(
    '/organizations/new',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

/* EDIT */
router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

/* ===================== PROJECTS ===================== */
router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage);

/* CREATE */
router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

/* EDIT */
router.get('/edit-project/:id', showEditProjectForm);

router.post('/edit-project/:id', processEditProjectForm);

/* ===================== CATEGORIES ===================== */
router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

/* CREATE */
router.get('/new-category', showNewCategoryForm);

router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

/* ASSIGN */
router.get('/assign-categories/:projectId', showAssignCategoriesForm);

router.post('/assign-categories/:projectId', processAssignCategoriesForm);

/* EDIT */
router.get('/edit-category/:id', showEditCategoryForm);

router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

/* ===================== AUTH ===================== */
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

router.get('/logout', processLogout);

router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);

/* ===================== ERROR TEST ===================== */
router.get('/test-error', testErrorPage);

export default router;
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
    showDashboard,
    showUsersPage
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

/* CREATE (PROTECTED) */
router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

/* EDIT (PROTECTED) */
router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    processEditProjectForm
);

/* ===================== CATEGORIES ===================== */
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

/* CREATE (PROTECTED) */
router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

/* ASSIGN (PROTECTED FIX) */
router.get(
    '/assign-categories/:projectId',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    requireRole('admin'),
    processAssignCategoriesForm
);

/* EDIT (PROTECTED) */
router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

/* ===================== AUTH ===================== */
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

/* LOGOUT */
router.get('/logout', processLogout);

/* DASHBOARD */
router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);

/* ===================== USERS (ADMIN ONLY) ===================== */
router.get(
    '/users',
    requireRole('admin'),
    showUsersPage
);

/* ===================== ERROR TEST ===================== */
router.get('/test-error', testErrorPage);

export default router;
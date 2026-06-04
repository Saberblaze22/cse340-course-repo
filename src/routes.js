import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showEditOrganizationForm,
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {     
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/organizations/new', showNewOrganizationForm);
router.post(
    '/organizations/new',
    organizationValidation,
    processNewOrganizationForm
);
router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

router.get('/projects', showProjectsPage);
// Route for project details page
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);
router.get('/edit-project/:id', showEditProjectForm);

router.post('/edit-project/:id', processEditProjectForm);

router.get('/categories', showCategoriesPage);
// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);

router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/new-category', showNewCategoryForm);

router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;
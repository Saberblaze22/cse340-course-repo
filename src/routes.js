import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

const {
    showNewOrganizationForm,
    processNewOrganizationForm
} = require('./controllers/organizations');

router.get('/organizations/new', showNewOrganizationForm);
router.post('/organizations/new', processNewOrganizationForm);

router.get('/projects', showProjectsPage);
// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

router.get('/categories', showCategoriesPage);
// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;
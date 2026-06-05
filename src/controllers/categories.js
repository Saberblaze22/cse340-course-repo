// Import model functions
import {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { body, validationResult } from 'express-validator';
import { getProjectDetails } from '../models/projects.js';

// Define controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const projects = await getProjectsByCategoryId(categoryId);

const showCategoryDetailsPage = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    const projects = await getProjectsByCategoryId(categoryId);

    const title = 'Category Details';

    res.render('category', {
        title,
        category,
        projects
    });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    let selectedCategoryIds = req.body.categoryIds || [];

    // normalize to array
    selectedCategoryIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, selectedCategoryIds);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showNewCategoryForm = async (req, res) => {

    res.render('new-category', {
        title: 'Add New Category'
    });
};

const processNewCategoryForm = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const { name } = req.body;

    const categoryId = await createCategory(name);

    req.flash('success', 'Category added successfully!');

    res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
};

const processEditCategoryForm = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const categoryId = req.params.id;
    const { name } = req.body;

    await updateCategory(categoryId, name);

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);
};
// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    categoryValidation
};
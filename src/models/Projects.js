import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT Project_id, title, description, location, project_date, organization
      FROM public.Project;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}  

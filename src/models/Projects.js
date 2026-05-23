import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT Projects_id, name, description, contact_email, logo_filename
      FROM public.Projects;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}  

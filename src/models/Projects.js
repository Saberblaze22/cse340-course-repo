import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT title, project_date, name
      FROM public.Project p
      JOIN public.Organization o ON p.organization_id = o.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}  

import { db } from "../database/connection.js";
import { projectsTable, usersTable } from "../database/schema.js";
import { desc, eq } from "drizzle-orm";

export const projectsService = {
    getAllProjects: async () => {
        try {
            const projects = await db.query.projectsTable.findMany({
                with: {
                    user: true,
                },
                orderBy: [desc(projectsTable.created_at)],
            });

            return projects;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    getProjectById: async (id) => {
        try {
            const project = await db.query.projectsTable.findFirst({
                where: eq(projectsTable.id, id),
                with: {
                    user: true,
                },
            });

            if (!project) {
                throw new Error(`Project with id ${id} not found.`);
            }

            return project;
        } catch (error) {
            throw new Error(`Could not fetch project with id ${id}: ${error.message}`);
        }
    },

    createNewProject: async (
        userId,
        title,
        url,
    ) => {
        try {
            const emptyFields = [];
            if (!userId) emptyFields.push("userId");
            if (!title) emptyFields.push("title");
            if (!url) emptyFields.push("url");

            if (emptyFields.length > 0) {
                throw new Error(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
            if (user.length === 0) {
                throw new Error(`User with id ${userId} not found.`);
            }

            const projectCreated = await db.insert(projectsTable).values({
                user_id: userId,
                tite: title, // Atenção: erro no schema → deve ser "title"
                url,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return projectCreated;
        } catch (error) {
            throw new Error(`Could not create new project: ${error.message}`);
        }
    },

    updateProjectById: async (
        id,
        userId,
        title,
        url,
    ) => {
        try {
            const project = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
            if (project.length === 0) {
                throw new Error(`Project with id ${id} not found.`);
            }


            const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
            if (user.length === 0) {
                throw new Error(`User with id ${userId} not found.`);
            }

            await db.update(projectsTable).set({
                user_id: userId,
                tite: title, // erro no schema
                url,
                updated_at: new Date(),
            }).where(eq(projectsTable.id, id));

            const updatedProject = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
            return updatedProject;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Could not update project with id ${id}: ${error.message}`);
        }
    },

    deleteProjectById: async (id) => {
        try {
            const project = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
            if (project.length === 0) {
                throw new Error(`Project with id ${id} not found.`);
            }

            await db.delete(projectsTable).where(eq(projectsTable.id, id));
            return;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Could not delete project with id ${id}: ${error.message}`);
        }
    }
};
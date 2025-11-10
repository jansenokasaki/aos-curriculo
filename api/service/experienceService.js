import { db } from "../database/connection.js";
import { experienceTable, usersTable } from "../database/schema.js";
import { desc, eq } from "drizzle-orm";

export const experienceService = {
    getAllExperiences: async () => {
        try {
            const experiences = await db.query.experienceTable.findMany({
                with: {
                    user: true,
                },
                orderBy: [desc(experienceTable.created_at)],
            });

            return experiences;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    getExperienceById: async (id) => {
        try {
            const experience = await db.query.experienceTable.findFirst({
                where: eq(experienceTable.id, id),
                with: {
                    user: true,
                },
            });

            if (!experience) {
                throw new Error(`Experience with id ${id} not found.`);
            }

            return experience;
        } catch (error) {
            throw new Error(`Could not fetch experience with id ${id}: ${error.message}`);
        }
    },

    createNewExperience: async (
        userId,
        start,
        end,
        content,
    ) => {
        try {

            const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
            if (user.length === 0) {
                throw new Error(`User with id ${userId} not found.`);
            }

            const experienceCreated = await db.insert(experienceTable).values({
                user_id: userId,
                start,
                end,
                content,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return experienceCreated;
        } catch (error) {
            throw new Error(`Could not create new experience: ${error.message}`);
        }
    },

    updateExperienceById: async (
        id,
        userId,
        start,
        end,
        content,
    ) => {
        try {
            

            const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
            if (user.length === 0) {
                throw new Error(`User with id ${userId} not found.`);
            }

            await db.update(experienceTable).set({
                user_id: userId,
                start,
                end,
                content,
                updated_at: new Date(),
            }).where(eq(experienceTable.id, id));

            const updatedExperience = await db.select().from(experienceTable).where(eq(experienceTable.id, id));
            return updatedExperience;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Could not update experience with id ${id}: ${error.message}`);
        }
    },

    deleteExperienceById: async (id) => {
        try {
            const experience = await db.select().from(experienceTable).where(eq(experienceTable.id, id));
            if (experience.length === 0) {
                throw new Error(`Experience with id ${id} not found.`);
            }

            await db.delete(experienceTable).where(eq(experienceTable.id, id));
            return;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Could not delete experience with id ${id}: ${error.message}`);
        }
    }
};
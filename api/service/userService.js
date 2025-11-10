import { db } from "../database/connection.js";
import { usersTable, experienceTable, projectsTable } from "../database/schema.js";
import { desc, eq } from "drizzle-orm";

export const userService = {
    getAllUsers: async () => {
        try {
            const users = await db.query.usersTable.findMany({
                with: {
                    experiences: {
                        orderBy: [desc(experienceTable.created_at)],
                    },
                    projects: {
                        orderBy: [desc(projectsTable.created_at)],
                    },
                },
            });

            return users;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    getUserById: async (id) => {
        try {
            const user = await db.query.usersTable.findFirst({
                where: eq(usersTable.id, id),
                with: {
                    experiences: {
                        orderBy: [desc(experienceTable.created_at)],
                    },
                    projects: {
                        orderBy: [desc(projectsTable.created_at)],
                    },
                },
            });

            if (!user) {
                throw new Error(`User with id ${id} not found.`);
            }

            return user;
        } catch (error) {
            throw new Error(`Could not fetch user with id ${id}: ${error.message}`);
        }
    },

    createNewUser: async (
        fullName,
        email,
        birthDate,
        description,
        address,
    ) => {
        try {
            const emptyFields = [];
            if (!fullName) emptyFields.push("fullName");
            if (!email) emptyFields.push("email");
            if (!birthDate) emptyFields.push("birthDate");
            if (!description) emptyFields.push("description");
            if (!address) emptyFields.push("address");

            if (emptyFields.length > 0) {
                throw new Error(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const userCreated = await db.insert(usersTable).values({
                full_name: fullName,
                email,
                birth_date: birthDate,
                description,
                address,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return userCreated;
        } catch (error) {
            throw new Error(`Could not create new user: ${error.message}`);
        }
    },

    updateUserById: async (
        id,
        fullName,
        email,
        birthDate,
        description,
        address,
    ) => {
        try {
            const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
            if (user.length === 0) {
                throw new Error(`User with id ${id} not found.`);
            }

            await db.update(usersTable).set({
                full_name: fullName,
                email,
                birth_date: birthDate,
                description,
                address,
                updated_at: new Date(),
            }).where(eq(usersTable.id, id));

            const updatedUser = await db.select().from(usersTable).where(eq(usersTable.id, id));
            return updatedUser;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Could not update user with id ${id}: ${error.message}`);
        }
    },

    deleteUserById: async (id) => {
        try {
            const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
            if (user.length === 0) {
                throw new Error(`User with id ${id} not found.`);
            }

            await db.delete(usersTable).where(eq(usersTable.id, id));
            return;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(`Could not delete user with id ${id}: ${error.message}`);
        }
    }
};
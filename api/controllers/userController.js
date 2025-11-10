import { userService } from "../service/userService.js";

export const userController = {
    getAllUsers: async (req, res) => {
        try {
            const result = await userService.getAllUsers();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching users: " + error.message });
        }
    },

    getUserById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        try {
            const result = await userService.getUserById(id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewUser: async (req, res) => {
        const { fullName, email, birthDate, description, address } = req.body;

        try {
            const result = await userService.createNewUser(
                fullName,
                email,
                birthDate,
                description,
                address
            );
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    updateUserById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const { fullName, email, birthDate, description, address } = req.body;

        try {
            const result = await userService.updateUserById(
                id,
                fullName,
                email,
                birthDate,
                description,
                address
            );
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    deleteUserById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        try {
            await userService.deleteUserById(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
};
import { projectsService } from "../service/projectsService.js";

export const projectsController = {
    getAllProjects: async (req, res) => {
        try {
            const result = await projectsService.getAllProjects();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching projects: " + error.message });
        }
    },

    getProjectById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID." });
        }

        try {
            const result = await projectsService.getProjectById(id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewProject: async (req, res) => {
        const { userId, title, url } = req.body;

        try {
            const result = await projectsService.createNewProject(userId, title, url);
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    updateProjectById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID." });
        }

        const { userId, title, url } = req.body;

        try {
            const result = await projectsService.updateProjectById(id, userId, title, url);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    deleteProjectById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID." });
        }

        try {
            await projectsService.deleteProjectById(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
};
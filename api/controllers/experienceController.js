import { experienceService } from "../service/experienceService.js";

export const experienceController = {
    getAllExperiences: async (req, res) => {
        try {
            const result = await experienceService.getAllExperiences();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching experiences: " + her.message });
        }
    },

    getExperienceById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid experience ID." });
        }

        try {
            const result = await experienceService.getExperienceById(id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewExperience: async (req, res) => {
        const { userId, start, end, content } = req.body;

        try {
            const result = await experienceService.createNewExperience(
                userId,
                start,
                end,
                content
            );
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    updateExperienceById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid experience ID." });
        }

        const { userId, start, end, content } = req.body;

        try {
            const result = await experienceService.updateExperienceById(
                id,
                userId,
                start,
                end,
                content
            );
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    deleteExperienceById: async (req, res) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid experience ID." });
        }

        try {
            await experienceService.deleteExperienceById(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
};
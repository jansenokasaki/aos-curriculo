import { Router } from "express";
import { projectsController } from "../controllers/projectsController.js";

const router = Router();

router.get("/", projectsController.getAllProjects);
router.get("/:id", projectsController.getProjectById);
router.post("/", projectsController.createNewProject);
router.patch("/:id", projectsController.updateProjectById);
router.delete("/:id", projectsController.deleteProjectById);

export default router;
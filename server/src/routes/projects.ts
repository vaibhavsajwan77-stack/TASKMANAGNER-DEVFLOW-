import { Router } from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectControllers';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
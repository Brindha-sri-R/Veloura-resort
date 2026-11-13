import express from 'express';
import { getStays, getStayBySlugOrId, getCategories } from '../controllers/stayController.js';

const router = express.Router();

router.get('/', getStays);
router.get('/categories', getCategories);
router.get('/:idOrSlug', getStayBySlugOrId);

export default router;


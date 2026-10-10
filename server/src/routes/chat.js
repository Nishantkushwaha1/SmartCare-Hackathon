import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/http.js';
import { validate } from '../middleware/validate.js';
import { webSearch } from '../services/tinyfish.js';

// Public endpoints for the patient chatbot. Each search costs TinyFish credits, so the limit is tight
// and the only thing exposed is a text search (no URL fetching, no browser automation).
const router = Router();
router.use(rateLimit({ windowMs: 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many searches. Please wait a minute.' } }));

const searchBody = z.object({ q: z.string().trim().min(3, 'Type a longer question').max(200, 'Question is too long') });

// POST /api/chat/search  { q }  ->  { query, results: [{ title, snippet, url, site }] }
router.post('/search', validate(searchBody), asyncHandler(async (req, res) => res.json(await webSearch(req.body.q))));

export default router;

import { Router } from 'express';
import type { Model } from 'mongoose';

// Only allow-listed fields can be written by clients.
function pick(body: Record<string, unknown> | undefined, fields: string[]) {
  const out: Record<string, unknown> = {};
  for (const f of fields) if (body && f in body) out[f] = body[f];
  return out;
}

export function crudRouter(model: Model<any>, writable: string[]): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await model.find().lean());
  });

  router.get('/:id', async (req, res) => {
    const doc = await model.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  });

  router.post('/', async (req, res) => {
    const doc = await model.create(pick(req.body, writable));
    res.status(201).json(doc);
  });

  router.put('/:id', async (req, res) => {
    const doc = await model.findByIdAndUpdate(req.params.id, pick(req.body, writable), {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  });

  router.delete('/:id', async (req, res) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  });

  return router;
}

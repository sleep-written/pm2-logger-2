import { resolve } from 'node:path';
import { Router } from 'express';
import { stat } from 'node:fs/promises';

const root = resolve(
    import.meta.dirname,
    '../../../../client/dist/client/browser'
);

/**
 * Static SPA router. Serves the compiled client from `client/dist/client/browser`:
 * if the requested path maps to a real file it is sent as-is, otherwise it falls
 * back to `index.html` to support client-side routing.
 */
export const indexRouter = Router().use(async (req, res) => {
    const fullpath = resolve(root, req.path.slice(1));
    let stats: { isFile(): boolean };
    try {
        stats = await stat(fullpath);
    } catch {
        stats = { isFile: () => false };
    }

    const path = stats.isFile()
    ?   req.path
    :   '/index.html';

    res.sendFile(path, { root });
});
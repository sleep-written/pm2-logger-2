import { SocketServerRouter } from '@bleed-believer/ws/server';
import { injector } from '@/injector.js';
import { parse } from 'ansicolor';
import { PM2 } from '@utils/pm2';

export const logRoute = new SocketServerRouter().use('log{/*name}', async ws => {
    const pm2 = injector.inject(PM2);
    const txt = ws.params.name?.join('/');
    const ids = typeof txt === 'string'
    ?   await pm2.getProcessIds(txt)
    :   undefined;

    if (Array.isArray(ids) && ids.length === 0) {
        const reason = `Process ids for "${txt}" not found`;
        return ws.close(4004, reason);
    }
        
    const log = pm2.log(ids ?? [], 'utf-8');
    log.on('stdout', message => {
        const type = 'stdout';
        const html = parse(message).spans
            .map(x => x.css.length > 0
                ?   `<span style="${x.css}">${x.text}</span>`
                :   `<span>${x.text}</span>`
            )
            .join('');

        const json = JSON.stringify({ type, html });
        ws.send(json);
    });
    
    log.on('stderr', message => {
        const type = 'stderr';
        const html = parse(message).spans
            .map(x => `<span style="${x.css}">${x.text}</span>`)
            .join('');

        const json = JSON.stringify({ type, html });
        ws.send(json);
    });

    ws.addEventListener('close', () => {
        log.kill();
    });
});
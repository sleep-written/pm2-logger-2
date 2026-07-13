import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SocketClient } from '@bleed-believer/ws/client';
import { HttpClient } from '@angular/common/http';

import { PM2Logger, PM2Process } from './interfaces';

@Service()
export class PM2Service {
    #http = inject(HttpClient);

    getProcessList(): Promise<PM2Process[]> {
        const obs = this.#http.get<PM2Process[]>('api/pm2');
        return firstValueFrom(obs);
    }

    async getProcessLog(name: string): Promise<PM2Logger> {
        const wsClient = new SocketClient(`/log/${name}`, { reconnectMs: 1_000 });
        await wsClient.connect();
        return {
            get listening() { return wsClient.listening },
            destroy: () => wsClient.close(),
            onStderr: c => wsClient.on('socketMessage', m => {
                const json = JSON.parse(m);
                if (json.type === 'stderr') c(json.html);
            }),
            onStdout: c => wsClient.on('socketMessage', m => {
                const json = JSON.parse(m);
                if (json.type === 'stdout') c(json.html);
            }),
        }
    }
}

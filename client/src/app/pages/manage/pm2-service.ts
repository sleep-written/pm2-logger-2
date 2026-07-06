import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PM2Logger, PM2Process } from './interfaces';

@Service()
export class PM2Service {
    #http = inject(HttpClient);

    getProcessList(): Promise<PM2Process[]> {
        const obs = this.#http.get<PM2Process[]>('api/pm2');
        return firstValueFrom(obs);
    }

    getProcessLog(name: string): PM2Logger {
        let stdoutEvent: ((message: string) => unknown)[] = [];
        let stderrEvent: ((message: string) => unknown)[] = [];

        const ws = new WebSocket(`/log/${name}`);
        ws.addEventListener('message', ({ data }) => {
            const json = JSON.parse(data);
            switch (json.type) {
                case 'stdout': {
                    for (const callback of stdoutEvent) {
                        callback(json.html);
                    }

                    break;
                }

                case 'stderr': {
                    for (const callback of stderrEvent) {
                        callback(json.html);
                    }

                    break;
                }
            }
        });

        return {
            onStdout(callback: (message: string) => unknown): void {
                stdoutEvent.push(callback);
            },
            onStderr(callback: (message: string) => unknown): void {
                stderrEvent.push(callback);
            },
            destroy: () => {
                stdoutEvent = [];
                stderrEvent = [];
                ws.close()
            }
        };
    }
}

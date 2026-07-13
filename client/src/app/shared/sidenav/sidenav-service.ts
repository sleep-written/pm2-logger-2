import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Menu } from './menu';

@Service()
export class SidenavService {
    #http = inject(HttpClient);

    get(): Promise<Menu[]> {
        const o = this.#http.get<Menu[]>('api/menu');
        return firstValueFrom(o);
    }
}
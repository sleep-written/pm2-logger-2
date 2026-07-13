import { ChangeDetectionStrategy, Component, inject, OnDestroy, output, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { SidenavService } from './sidenav-service';
import { Menu } from './menu';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidenav implements OnDestroy {
  #sidenavService = inject(SidenavService);
  #router = inject(Router);
  #subs = this.#router
    .events
    .pipe(filter(x => x instanceof NavigationEnd))
    .subscribe(() => this.onNavigationEnd());

  navigationEnd = output<void>();
  dataSource = signal<Menu[]>([]);
  loading = signal(false);

  async onNavigationEnd(): Promise<void> {
    try {
      this.loading.set(true);
      const data = await this.#sidenavService.get();
      this.dataSource.set(data);
    } catch (err) {
      console.error(err);
      this.dataSource.set([]);
    } finally {
      this.loading.set(false);
      this.navigationEnd.emit();
    }
  }

  ngOnDestroy(): void {
    this.#subs.unsubscribe();
  }
}

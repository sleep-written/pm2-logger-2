import { ChangeDetectionStrategy, Component, effect, inject, OnInit, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { PM2Service } from '../pm2-service';
import { PM2Process } from '../interfaces/pm2-process';

@Component({
  selector: 'app-pm2-process-list',
  standalone: false,
  templateUrl: './pm2-process-list.html',
  styleUrl: './pm2-process-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pm2ProcessList implements OnInit {
  #pm2Service = inject(PM2Service);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  #selectedName = toSignal(
    this.#route.paramMap.pipe(map(x => x.get('pm2ProcessName'))),
    { initialValue: null }
  );

  dataSource = signal<PM2Process[]>([]);
  pm2Process = output<PM2Process>();

  constructor() {
    effect(() => {
      const name = this.#selectedName();
      const pm2Process = this.dataSource().find(x => x.name === name);
      if (pm2Process) {
        this.pm2Process.emit(pm2Process);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.#pm2Service
      .getProcessList()
      .then(x => this.dataSource.set(x));
  }

  isSelected(pm2Process: PM2Process): boolean {
    return this.#selectedName() === pm2Process.name;
  }

  onClick(pm2Process: PM2Process): void {
    this.#router.navigate([ '/manage', ...pm2Process.name.split('/') ]);
  }
}

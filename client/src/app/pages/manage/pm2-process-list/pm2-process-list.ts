import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
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

  dataSource = signal<PM2Process[]>([]);
  pm2Process = output<PM2Process>();

  async ngOnInit(): Promise<void> {
    await this.#pm2Service
      .getProcessList()
      .then(x => this.dataSource.set(x));
  }
}

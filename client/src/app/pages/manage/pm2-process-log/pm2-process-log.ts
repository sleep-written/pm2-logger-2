import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnDestroy, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PM2Logger, PM2Process } from '../interfaces';
import { PM2Service } from '../pm2-service';

@Component({
  selector: 'app-pm2-process-log',
  standalone: false,
  templateUrl: './pm2-process-log.html',
  styleUrl: './pm2-process-log.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pm2ProcessLog implements OnChanges, OnDestroy {
  #domSanitizer = inject(DomSanitizer);
  #pm2Service = inject(PM2Service);

  prevPm2ProcessId = signal<number | null>(null);
  pm2Process = input<PM2Process | null>(null);
  pm2Logger = signal<PM2Logger | null>(null);
  stdout = signal<string[]>([]);
  stderr = signal<string[]>([]);

  ngOnDestroy(): void {
    const logger = this.pm2Logger();
    if (logger) {
      logger.destroy();
      this.pm2Logger.set(null);
    }
  }

  async ngOnChanges(): Promise<void> {
    this.ngOnDestroy();

    const prevPm2ProcessId = this.prevPm2ProcessId();
    const process = this.pm2Process();
    if (process && process.id !== prevPm2ProcessId) {
      this.stdout.set([]);
      this.stderr.set([]);

      const logger = this.#pm2Service.getProcessLog(process.name);
      logger.onStdout(this.onStdout.bind(this));
      logger.onStderr(this.onStderr.bind(this));

      this.pm2Logger.set(logger);
      this.prevPm2ProcessId.set(process.id);
    }
  }

  sanitize(input: string): SafeHtml {
    return this.#domSanitizer.bypassSecurityTrustHtml(input);
  }

  onStdout(message: string): void {
    const stdout = this.stdout();
    this.stdout.set([ ...stdout, message ]);
  }

  onStderr(message: string): void {
    const stderr = this.stderr();
    this.stderr.set([ ...stderr, message ]);
  }
}

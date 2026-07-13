import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnChanges, OnDestroy, signal, viewChild } from '@angular/core';
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
  
  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly list = viewChild<ElementRef<HTMLElement>>('list');

  prevPm2ProcessId = signal<number | null>(null);
  pm2Process = input<PM2Process | null>(null);
  pm2Logger = signal<PM2Logger | null>(null);
  maxLength = input<number>(100);
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

      const logger = await this.#pm2Service.getProcessLog(process.name);
      logger.onStdout(this.onStdout.bind(this));
      logger.onStderr(this.onStderr.bind(this));

      this.pm2Logger.set(logger);
      this.prevPm2ProcessId.set(process.id);
    }
  }

  sanitize(input: string): SafeHtml {
    return this.#domSanitizer.bypassSecurityTrustHtml(input);
  }

  /**
   * Whether the last 3 log lines are currently visible within the scroll area.
   * Used to keep the view pinned to the bottom only while the user is already
   * reading the latest logs, without yanking them down if they scrolled up.
   */
  private isBottomVisible(): boolean {
    const host = this.elementRef?.nativeElement;
    const list = this.list()?.nativeElement;
    if (!host || !list) {
      return true;
    }

    const items = Array.from(list.children).slice(-3);
    if (items.length === 0) {
      return true;
    }

    const { top, bottom } = host.getBoundingClientRect();
    return items.every(el => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > top && rect.top < bottom;
    });
  }

  async autoScroll(): Promise<void> {
    await new Promise(r => setTimeout(r, 50));

    const host = this.elementRef?.nativeElement!;
    host.scrollTo({
      top: host.scrollHeight - host.offsetHeight,
      behavior: 'smooth'
    });
  }

  onStdout(message: string): Promise<void> {
    const stick = this.isBottomVisible();
    const stdout = [ ...this.stdout(), message ];
    const maxLength = Math.abs(this.maxLength()) * -1;
    this.stdout.set(stdout.slice(maxLength));
    return stick ? this.autoScroll() : Promise.resolve();
  }

  onStderr(message: string): Promise<void> {
    const stick = this.isBottomVisible();
    const stderr = [ ...this.stderr(), message ];
    const maxLength = Math.abs(this.maxLength()) * -1;
    this.stderr.set(stderr.slice(maxLength));
    return stick ? this.autoScroll() : Promise.resolve();
  }
}

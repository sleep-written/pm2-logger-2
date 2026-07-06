import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  #title = inject(Title);

  protected readonly title = signal('client');
  protected readonly opened = signal(false);

  ngOnInit(): void {
    this.#title.setTitle('PM2 Logger');
  }
}

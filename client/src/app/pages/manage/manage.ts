import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PM2Process } from './interfaces';

@Component({
  selector: 'app-manage',
  standalone: false,
  templateUrl: './manage.html',
  styleUrl: './manage.scss',
})
export class Manage implements OnInit {
  #title = inject(Title);

  pm2Process = signal<PM2Process | null>(null);

  ngOnInit(): void {
    this.#title.setTitle('PM2 process manager');
  }
}

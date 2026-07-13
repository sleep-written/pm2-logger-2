import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Sidenav } from './sidenav';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SidenavService } from './sidenav-service';
import { provideHttpClient } from '@angular/common/http';
import { MAT_ICON_DEFAULT_OPTIONS, MatIconDefaultOptions } from '@angular/material/icon';

@NgModule({
  declarations: [
    Sidenav
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    SidenavService,
    provideHttpClient(),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: {
        fontSet: 'mat-symbols-outlined'
      } as MatIconDefaultOptions
    }
  ],
  exports: [
    Sidenav
  ]
})
export class SidenavModule {}

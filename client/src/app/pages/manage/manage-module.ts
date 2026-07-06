import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRoutingModule } from './manage-routing-module';

import { Manage } from './manage';
import { Pm2ProcessLog } from './pm2-process-log';
import { Pm2ProcessList } from './pm2-process-list';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

import { PM2Service } from './pm2-service';
import { provideHttpClient } from '@angular/common/http';
import { MAT_ICON_DEFAULT_OPTIONS, MatIconDefaultOptions } from '@angular/material/icon';

@NgModule({
  declarations: [
    Manage,
    Pm2ProcessLog,
    Pm2ProcessList,
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,

    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatRippleModule,
  ],
  providers: [
    PM2Service,
    provideHttpClient(),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: {
        fontSet: 'material-symbols-outlined',
      } as MatIconDefaultOptions,
    },
  ],
})
export class ManageModule {}

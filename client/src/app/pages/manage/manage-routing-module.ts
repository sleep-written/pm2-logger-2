import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Manage } from './manage';

const routes: Routes = [{ path: '', component: Manage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}

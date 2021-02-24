import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteComponent } from './route.component';
import { RouteListComponent } from './route-list/route-list.component';
import { RouteFormComponent } from './route-form/route-form.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    RouteComponent,
    RouteListComponent,
    RouteFormComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'route',
        component: RouteComponent,
      }
    ])
  ]
})
export class RouteModule { }

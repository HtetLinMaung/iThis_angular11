import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonTypeFormComponent } from './common-type-form/common-type-form.component';
import { CommonTypeListComponent } from './common-type-list/common-type-list.component';
import { CommonTypeComponent } from './common-type.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    CommonTypeFormComponent,
    CommonTypeListComponent,
    CommonTypeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'common-type',
        component: CommonTypeComponent,
      },
    ])
  ]
})
export class CommonTypeModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { PatientTypeFormComponent } from './patient-type-form/patient-type-form.component';
import { PatientTypeListComponent } from './patient-type-list/patient-type-list.component';
import { PatientTypeComponent } from './patient-type.component';

@NgModule({
  declarations: [PatientTypeComponent, PatientTypeListComponent, PatientTypeFormComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'patient-type',
        component: PatientTypeComponent,
      }
    ])
  ]
})
export class PatientTypeModule { }

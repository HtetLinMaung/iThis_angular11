import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { NursingCareRecordFormComponent } from './nursing-care-record-form/nursing-care-record-form.component';
import { NursingCareRecordListComponent } from './nursing-care-record-list/nursing-care-record-list.component';
import { NursingCareRecordComponent } from './nursing-care-record.component';

@NgModule({
  declarations: [
    NursingCareRecordComponent,
    NursingCareRecordFormComponent,
    NursingCareRecordListComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'nursing-care-record',
        component: NursingCareRecordComponent,
      },
    ])
  ]
})
export class NursingCareRecordModule { }

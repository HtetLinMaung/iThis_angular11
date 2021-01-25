import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { NurseShiftSummaryFormComponent } from './nurse-shift-summary-form/nurse-shift-summary-form.component';
import { NurseShiftSummaryListComponent } from './nurse-shift-summary-list/nurse-shift-summary-list.component';
import { NurseShiftSummaryComponent } from './nurse-shift-summary.component';

@NgModule({
  declarations: [
    NurseShiftSummaryComponent,
    NurseShiftSummaryFormComponent,
    NurseShiftSummaryListComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'nurse-shift-summary',
        component: NurseShiftSummaryComponent,
      },
    ])
  ]
})
export class NurseShiftSummaryModule { }

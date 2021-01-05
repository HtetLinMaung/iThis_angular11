import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InpatientMedicationRecordComponent } from './inpatient-medication-record/inpatient-medication-record.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InpatientMedicationRecordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'inpatient-medication-record',
        component: InpatientMedicationRecordComponent,
      },
    ]),
  ],
})
export class MedicalModule {}

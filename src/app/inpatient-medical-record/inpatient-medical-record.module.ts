import { NgModule } from '@angular/core';
import { InstructionComponent } from './instruction/instruction.component';
import { RouterModule } from '@angular/router';
import { InstructionFormComponent } from './instruction/instruction-form/instruction-form.component';
import { InstructionListComponent } from './instruction/instruction-list/instruction-list.component';
import { StatMedicationComponent } from './stat-medication/stat-medication.component';
import { StatMedicationFormComponent } from './stat-medication/stat-medication-form/stat-medication-form.component';
import { StatMedicationListComponent } from './stat-medication/stat-medication-list/stat-medication-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    InstructionComponent,
    InstructionFormComponent,
    InstructionListComponent,
    StatMedicationComponent,
    StatMedicationFormComponent,
    StatMedicationListComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'inpatient-medication-record/instruction',
        component: InstructionComponent,
      },
      {
        path: 'inpatient-medication-record/stat-medication',
        component: StatMedicationComponent,
      },
    ]),
  ],
})
export class InpatientMedicalRecordModule {}

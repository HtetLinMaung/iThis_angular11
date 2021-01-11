import { NgModule } from '@angular/core';
import { InstructionComponent } from './instruction/instruction.component';
import { RouterModule } from '@angular/router';
import { InstructionFormComponent } from './instruction/instruction-form/instruction-form.component';
import { InstructionListComponent } from './instruction/instruction-list/instruction-list.component';
import { StatMedicationComponent } from './stat-medication/stat-medication.component';
import { StatMedicationFormComponent } from './stat-medication/stat-medication-form/stat-medication-form.component';
import { StatMedicationListComponent } from './stat-medication/stat-medication-list/stat-medication-list.component';
import { SharedModule } from '../shared/shared.module';
import { NonParenteralComponent } from './non-parenteral/non-parenteral.component';
import { NonParenteralFormComponent } from './non-parenteral/non-parenteral-form/non-parenteral-form.component';
import { NonParenteralListComponent } from './non-parenteral/non-parenteral-list/non-parenteral-list.component';

@NgModule({
  declarations: [
    InstructionComponent,
    InstructionFormComponent,
    InstructionListComponent,
    StatMedicationComponent,
    StatMedicationFormComponent,
    StatMedicationListComponent,
    NonParenteralComponent,
    NonParenteralFormComponent,
    NonParenteralListComponent,
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
      {
        path: 'inpatient-medication-record/non-parenteral',
        component: NonParenteralComponent,
      },
    ]),
  ],
})
export class InpatientMedicalRecordModule {}

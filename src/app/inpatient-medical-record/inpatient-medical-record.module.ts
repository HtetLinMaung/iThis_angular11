import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TableComponent } from '../framework/table/table.component';
import { NurseShiftSummaryComponent } from '../nurse-shift-summary/nurse-shift-summary.component';
import { NursingCareRecordComponent } from '../nursing-care-record/nursing-care-record.component';
import { SharedModule } from '../shared/shared.module';
import { BloodFormComponent } from './blood/blood-form/blood-form.component';
import { BloodListComponent } from './blood/blood-list/blood-list.component';
import { BloodComponent } from './blood/blood.component';
import { DietFormComponent } from './diet/diet-form/diet-form.component';
import { DietListComponent } from './diet/diet-list/diet-list.component';
import { DietComponent } from './diet/diet.component';
import { InjectionFormComponent } from './injection/injection-form/injection-form.component';
import { InjectionListComponent } from './injection/injection-list/injection-list.component';
import { InjectionComponent } from './injection/injection.component';
import { InstructionFormComponent } from './instruction/instruction-form/instruction-form.component';
import { InstructionListComponent } from './instruction/instruction-list/instruction-list.component';
import { InstructionComponent } from './instruction/instruction.component';
import { NonParenteralFormComponent } from './non-parenteral/non-parenteral-form/non-parenteral-form.component';
import { NonParenteralListComponent } from './non-parenteral/non-parenteral-list/non-parenteral-list.component';
import { NonParenteralComponent } from './non-parenteral/non-parenteral.component';
import { StatMedicationFormComponent } from './stat-medication/stat-medication-form/stat-medication-form.component';
import { StatMedicationListComponent } from './stat-medication/stat-medication-list/stat-medication-list.component';
import { StatMedicationComponent } from './stat-medication/stat-medication.component';

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
    InjectionComponent,
    InjectionFormComponent,
    InjectionListComponent,
    BloodComponent,
    BloodFormComponent,
    BloodListComponent,
    DietComponent,
    DietFormComponent,
    DietListComponent,
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
      {
        path: 'inpatient-medication-record/injection',
        component: InjectionComponent,
      },
      {
        path: 'inpatient-medication-record/blood',
        component: BloodComponent,
      },
      {
        path: 'inpatient-medication-record/diet',
        component: DietComponent,
      },
      {
        path: 'nurse-shift-summary',
        component: NurseShiftSummaryComponent,
      },
      {
        path: 'nursing-care-record',
        component: NursingCareRecordComponent,
      },
    ]),
  ],
})
export class InpatientMedicalRecordModule { }

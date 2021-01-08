import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionComponent } from './instruction/instruction.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstructionFormComponent } from './instruction/instruction-form/instruction-form.component';
import { InstructionListComponent } from './instruction/instruction-list/instruction-list.component';
import { TableComponent } from '../framework/table/table.component';
import { PaginationComponent } from '../framework/pagination/pagination.component';
import { DeleteDialogComponent } from '../framework/delete-dialog/delete-dialog.component';
import { PatientHeaderComponent } from '../framework/patient-header/patient-header.component';
import { AdvanceSearchComponent } from '../framework/advance-search/advance-search.component';
import { StatMedicationComponent } from './stat-medication/stat-medication.component';
import { StatMedicationFormComponent } from './stat-medication/stat-medication-form/stat-medication-form.component';
import { StatMedicationListComponent } from './stat-medication/stat-medication-list/stat-medication-list.component';

@NgModule({
  declarations: [
    InstructionComponent,
    InstructionFormComponent,
    InstructionListComponent,
    TableComponent,
    PaginationComponent,
    DeleteDialogComponent,
    PatientHeaderComponent,
    AdvanceSearchComponent,
    StatMedicationComponent,
    StatMedicationFormComponent,
    StatMedicationListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
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

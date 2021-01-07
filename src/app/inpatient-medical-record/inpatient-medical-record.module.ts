import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionComponent } from './instruction/instruction.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstructionFormComponent } from './instruction/instruction-form/instruction-form.component';
import { InstructionListComponent } from './instruction/instruction-list/instruction-list.component';

@NgModule({
  declarations: [InstructionComponent, InstructionFormComponent, InstructionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'inpatient-medication-record/instruction',
        component: InstructionComponent,
      },
    ]),
  ],
})
export class InpatientMedicalRecordModule {}

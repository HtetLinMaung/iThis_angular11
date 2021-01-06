import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionComponent } from './instruction/instruction.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [InstructionComponent],
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

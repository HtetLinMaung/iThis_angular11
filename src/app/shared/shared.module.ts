import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientHeaderComponent } from '../framework/patient-header/patient-header.component';
import { TableComponent } from '../framework/table/table.component';
import { PaginationComponent } from '../framework/pagination/pagination.component';
import { DeleteDialogComponent } from '../framework/delete-dialog/delete-dialog.component';
import { AdvanceSearchComponent } from '../framework/advance-search/advance-search.component';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    PatientHeaderComponent,
    TableComponent,
    PaginationComponent,
    DeleteDialogComponent,
    AdvanceSearchComponent,
  ],
  declarations: [
    PatientHeaderComponent,
    TableComponent,
    PaginationComponent,
    DeleteDialogComponent,
    AdvanceSearchComponent,
  ],
  imports: [CommonModule, FormsModule],
})
export class SharedModule {}

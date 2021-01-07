import { Component, OnInit } from '@angular/core';
import { InstructionStoreService } from '../instruction-store.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/framework/http.service';
import Instruction from '../Instruction.model';

@Component({
  selector: 'app-instruction-list',
  templateUrl: './instruction-list.component.html',
  styleUrls: ['./instruction-list.component.css'],
})
export class InstructionListComponent implements OnInit {
  headers = ['Date', 'Date Taken', 'Drug Allergy To', 'Instruction', 'Remarks'];
  page = 1;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  constructor(
    public instructionStoreService: InstructionStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.fetchAllInstructions();
  }

  formatDate(dateStr: string, format: string) {
    return moment(dateStr).format(format);
  }

  fetchAllInstructions() {
    this.http
      .doGet(`inpatient-medical-record/instructions`)
      .subscribe((data: any) => {
        this.instructionStoreService.instructions = data.map(
          (v) =>
            new Instruction(
              v.syskey,
              v.date,
              v.dateTaken,
              v.drugAllergyTo,
              v.instruction,
              v.remarks
            )
        );
      });
  }

  goToList(syskey: number) {
    this.instructionStoreService.currentSysKey = syskey;
  }
}

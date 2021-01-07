import { Component, OnInit } from '@angular/core';
import { InstructionStoreService } from '../instruction-store.service';
import * as moment from 'moment';

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

  constructor(public instructionStoreService: InstructionStoreService) {}

  ngOnInit(): void {
    console.log(this.instructionStoreService.instructions$);
  }

  formatDate(dateStr: string, format: string) {
    return moment(dateStr).format(format);
  }
}

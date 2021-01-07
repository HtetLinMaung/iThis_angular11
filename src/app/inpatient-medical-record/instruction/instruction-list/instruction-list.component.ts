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

  constructor(public instructionStoreService: InstructionStoreService) {}

  ngOnInit(): void {
    console.log(this.instructionStoreService.instructions$);
  }

  formatDate(dateStr: string, format: string) {
    return moment(dateStr).format(format);
  }
}

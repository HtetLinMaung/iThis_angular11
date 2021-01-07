import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { InstructionStoreService } from '../instruction-store.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-instruction-form',
  templateUrl: './instruction-form.component.html',
  styleUrls: ['./instruction-form.component.css'],
})
export class InstructionFormComponent implements OnInit {
  date = '';
  dateTaken = '';
  drugAllergyTo = '';
  instruction = '';
  remarks = '';

  currentSysKey = 0; // temp

  constructor(
    private http: HttpService,
    public instructionStoreService: InstructionStoreService
  ) {}

  ngOnInit(): void {
    this.bindEditData();
  }

  new() {
    this.instructionStoreService.isUpdate = false;
    this.date = '';
    this.dateTaken = '';
    this.drugAllergyTo = '';
    this.instruction = '';
    this.remarks = '';
  }

  bindEditData() {
    if (this.instructionStoreService.isUpdate) {
      const tabEle1 = document.getElementById('tab1');
      const tabEle2 = document.getElementById('tab2');
      tabEle2.style.background = '#3b5998';
      tabEle1.style.background = '#8C9899';

      const instruction = this.instructionStoreService.instructions.find(
        (v) => v.syskey == this.instructionStoreService.currentSysKey
      );

      this.date = instruction.date;
      this.dateTaken = instruction.dateTaken;
      this.drugAllergyTo = instruction.drugAllergyTo;
      this.instruction = instruction.instruction;
      this.remarks = instruction.remarks;
    }
  }

  save() {
    this.http
      .doPost(
        `inpatient-medical-record/${
          this.instructionStoreService.isUpdate
            ? 'update-instruction/' + this.instructionStoreService.currentSysKey
            : 'save-instruction'
        }`,
        {
          syskey: 0, // dummy syskey, it is not used is service
          pId: 1,
          RgsNo: 1,
          userid: '',
          username: '',
          date: this.date,
          dateTaken: this.dateTaken,
          drugAllergyTo: this.drugAllergyTo,
          instruction: this.instruction,
          remarks: this.remarks,
        }
      )
      .subscribe((data: any) => {
        if (!this.instructionStoreService.isUpdate) {
          this.instructionStoreService.currentSysKey = data.syskey;
        }
        this.instructionStoreService.isUpdate = true;
      });
  }

  delete() {
    if (this.instructionStoreService.isUpdate)
      this.instructionStoreService.deleteDialog = true;
  }

  print() {
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    doc.save('a4.pdf');
  }
}

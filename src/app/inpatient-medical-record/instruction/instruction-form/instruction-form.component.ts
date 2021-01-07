import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { InstructionStoreService } from '../instruction-store.service';

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
    console.log(this.instructionStoreService.isUpdate);
  }

  new() {
    this.instructionStoreService.isUpdate = false;
    this.date = '';
    this.dateTaken = '';
    this.drugAllergyTo = '';
    this.instruction = '';
    this.remarks = '';
  }

  save() {
    this.http
      .doPost(
        `inpatient-medical-record/${
          this.instructionStoreService.isUpdate
            ? 'update-instruction/' + this.currentSysKey
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
      .subscribe((data) => {
        console.log(data);
        if (!this.instructionStoreService.isUpdate) {
          // this.currentSysKey = data.syskey;
        }
        this.instructionStoreService.isUpdate = true;
      });
  }
}

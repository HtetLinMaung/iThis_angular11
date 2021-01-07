import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';

@Component({
  selector: 'app-instruction-form',
  templateUrl: './instruction-form.component.html',
  styleUrls: ['./instruction-form.component.css'],
})
export class InstructionFormComponent implements OnInit {
  date = null;
  dateTaken = null;
  drugAllergyTo = '';
  instruction = '';
  remarks = '';
  isUpdate = false;

  currentSysKey = 0; // temp

  constructor(private http: HttpService) {}

  ngOnInit(): void {}

  save() {
    console.log(this);
    this.http
      .doPost(
        `inpatient-medical-record/${
          this.isUpdate
            ? 'update-instruction/' + this.currentSysKey
            : 'save-instruction'
        }`,
        {
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
        this.isUpdate = true;
      });
  }
}

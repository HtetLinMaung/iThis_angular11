
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';

import { NurseShiftSummaryService } from '../nurse-shift-summary.service';

@Component({
  selector: 'app-nurse-shift-summary-form',
  templateUrl: './nurse-shift-summary-form.component.html',
  styleUrls: ['./nurse-shift-summary-form.component.css']
})
export class NurseShiftSummaryFormComponent implements OnInit {
  _obj = this.getObj();
  parentcheck: boolean;
  childcheck: boolean;
  parentcheck1: boolean;
  childcheck1: boolean;
  parentcheck2: boolean;
  childcheck2: boolean;
  btn: boolean = false;
  _btn_flag = { "_delete": false, "_save": false };
  constructor(
    private http: HttpService,
    public instructionStoreService: NurseShiftSummaryService,
    public appStoreService: AppStoreService,

  ) { }
  ngOnInit(): void {
    this.getNurse();
  }
  getObj() {
    return {
      syskey: "",
      autokey: 0,
      createddate: "",
      modifieddate: "",
      userid: "",
      username: "",
      RecordStatus: 0,
      SyncStatus: 0,
      SyncBatch: 0,
      usersyskey: 0,
      parentid: 0,
      eMRType: "",
      refNo: "",
      rgsNo: 0,
      pId: 0,
      hsId: 0,
      doctorId: "",
      dayNight: 0,
      t1: "",
      t2: "",
      t3: "",
      t4: "",
      t5: "",
      t6: "",
      t7: "",
      t8: "",
      t9: "",
      t10: "",
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
      n6: 0,
      n7: 0,
      n9: 0,
      n10: 0,
      remark1: "",
      remark2: "",
    };
  }
  checkDayNight(myRadio) {
    if (myRadio == '1')
      this.parentcheck = true;
    else
      this.childcheck = true;
    this._obj.dayNight = +myRadio;
  }
  checkRadio(myRadio) {
    if (myRadio == '1')
      this.parentcheck2 = true;
    else
      this.childcheck2 = true;
    this._obj.t1 = '';
    this._obj.n7 = +myRadio;
  }
  checkCare(myRadio) {
    if (myRadio == '1')
      this.parentcheck1 = true;
    else
      this.childcheck1 = true;
    this._obj.n6 = +myRadio;

  }
  goNew() {
    this._obj = this.getObj();
    this.childcheck = false;
    this.parentcheck = false;
    this.childcheck1 = false;
    this.parentcheck1 = false;
    this.childcheck2 = false;
    this.parentcheck2 = false;
  }
  save() {
    if (!this.valide()) {
      alert("fill all blanks");
      return;
    }
    let url: string = `nurseshiftsummary/save`;
    this.http.doPost(url, this._obj).subscribe(
      (data: any) => {
        if (data.message == "SUCCESS") {
          alert("Saved Successfully.");
          this.goNew();
        } else if (data.message == "FAIL") {
          alert("Saving Fail.");
          this._btn_flag._save = false;
        } else if (data.message == "EXIT") {
          alert("Saving Fail.");
          this._btn_flag._save = false;
        } else {
          alert("Saving Fail.");
          this._btn_flag._save = false;
        }
      },
      error => {
        this._btn_flag._save = false;
        alert("Saving Fail.");
      });
  }
  valide(): boolean {

    if (this._obj.t2 == "") return false;
    if (this._obj.t3 == "") return false;
    if (this._obj.t4 == "") return false;
    if (this._obj.t5 == "") return false;
    if (this._obj.t6 == "") return false;
    if (this._obj.t7 == "") return false;
    else return true;

  }
  goDelete() {
    let url: string = `nurseshiftsummary/delete`;
    this.http.doPost(url, this._obj).subscribe(
      (data: any) => {
        if (data.message == "Success") {
          alert("Delete Successfully.");
          this.goNew();

        } else if (data.message == "deleteFail") {
          alert("Delete Fail.");
        } else {
          alert("Delete Fail .");
        }
      },
      error => {
        alert("Delete Fail .");

      }
    );
  }
  getNurse() {
    let url: string = `nurseshiftsummary/get`;
    this.http.doPost(url, { syskey: this.instructionStoreService._syskey }).subscribe(
      (data: any) => {
        this._obj = data.NurseList[0];
      },
    );
  }
  print() {

    const doc = new jsPDF();
    doc.setFontSize(11);
    doc.text('ASIA ROYAL HOSPITAL', 105, 5, { align: 'center' });
    doc.text('NURSING SHIFT SUMMARY', 105, 13, { align: 'center' });
    doc.text('Pationt Label', 20, 13);
    doc.rect(17, 8, 50, 15);
    doc.setFontSize(10);
    doc.text('Room No.', 10, 30);
    doc.rect(27, 26, 27, 5);
    doc.text('Date:', 70, 30);
    doc.setLineWidth(0.5);
    doc.line(100, 30, 80, 30);
    doc.text('Day', 110, 30);
    doc.rect(120, 26, 7, 5);
    doc.text('Night', 130, 30);
    doc.rect(140, 26, 7, 5);
    doc.text('Care Plan Reviewed(tick only):', 10, 45);
    doc.text('Yes', 70, 45);
    doc.rect(80, 41, 7, 5);
    doc.text('No', 95, 45);
    doc.rect(105, 41, 7, 5);
    doc.text('Specific Instruction/Mention:', 10, 55);
    doc.text('Yes', 10, 65);
    doc.rect(20, 61, 7, 5);
    doc.text('No', 30, 65);
    doc.rect(40, 61, 7, 5);
    doc.line(10, 75, 200, 75);
    doc.line(10, 85, 200, 85);
    doc.text('Vitals:', 10, 95);
    doc.line(20, 95, 200, 95);
    doc.text('(Last Record)', 10, 100);
    doc.text('General Condition', 10, 110);
    doc.line(10, 120, 200, 120);
    doc.line(10, 130, 200, 130);
    doc.line(10, 140, 200, 140);
    doc.line(10, 150, 200, 150);
    doc.text('Intake/Output:(Special Mention)', 10, 160);
    doc.line(10, 170, 200, 170);
    doc.line(10, 180, 182, 180);
    doc.text('(Refer I/O)', 200, 180, { align: 'right' });
    doc.text('Problem(Nursing):', 10, 190);
    doc.line(39, 190, 200, 190);
    doc.line(10, 200, 200, 200);
    doc.text('Intervention:', 10, 210);
    doc.line(30, 210, 200, 210);
    doc.line(10, 220, 200, 220);
    doc.text('Evaluation:', 10, 230);
    doc.line(28, 230, 200, 230);
    doc.line(10, 240, 200, 240);
    doc.text('Sign', 120, 260);
    doc.line(130, 260, 200, 260);
    doc.text('Name & Rank:', 120, 268);
    doc.line(145, 268, 200, 268);
    doc.text('Date:', 120, 276);
    doc.line(130, 276, 200, 276);
    doc.text('Page 1 of 1', 200, 281, { align: 'right' });
    doc.save('Nurse Shift Summary.pdf');
  }

}

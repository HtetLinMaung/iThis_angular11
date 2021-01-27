import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';

import { NursingCareRecordService } from '../nursing-care-record.service';

@Component({
  selector: 'app-nursing-care-record-form',
  templateUrl: './nursing-care-record-form.component.html',
  styleUrls: ['./nursing-care-record-form.component.css']
})
export class NursingCareRecordFormComponent implements OnInit {
  btn: boolean = true;
  patientcheck1: boolean = false;
  patientcheck2: boolean = false;
  patientcheck3: boolean = false;
  patientcheck4: boolean = false;
  patientcheck5: boolean = false;
  patientcheck6: boolean = false;
  checkpatient1: boolean = false;
  checkpatient2: boolean = false;
  _obj = this.getObj();
  _rsobj = this.getRsObj();
  constructor(
    private http: HttpService,
    public instructionStoreService: NursingCareRecordService,
    public appStoreService: AppStoreService,
  ) { }

  ngOnInit(): void {
    this.getNurse();
    this.getRelationship();
  }
  checkRadio(myRadio) {
    if (myRadio == '1')
      this.patientcheck1 = true;
    else if (myRadio == '2')
      this.patientcheck2 = true;
    else if (myRadio == '3')
      this.patientcheck3 = true;
    else if (myRadio == '4')
      this.patientcheck4 = true;
    else if (myRadio == '5')
      this.patientcheck5 = true;
    else
      this.patientcheck6 = true;
    this._obj.t8 = "";
    this._obj.n5 = +myRadio;
  }
  checkpatient(myRadio) {
    if (myRadio == '1')
      this.checkpatient1 = true;

    else
      this.checkpatient2 = true;
    this._obj.t9 = "";
    this._obj.n6 = +myRadio;
  }
  getRsObj() {
    return {
      syskey: "",
      t1: "",
      t2: "",
    };
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
      pId: 0,
      eMRType: "",
      refNo: "",
      rgsNo: 0,
      hsId: 0,
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
      phone1: "",
      phone2: "",
      phone3: "",
      phone4: "",
      phone5: "",
      phone6: "",
      phone7: "",
      phone8: "",
      phone9: "",
      phone10: "",
      phone11: "",
      phone12: "",
      phone13: "",
      phone14: "",
      phone15: "",
      phone16: "",
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
      n6: 0,
      n7: 0,
      n9: 0,
      n10: 0,
    };
  }
  goNew() {
    this._obj = this.getObj();
    this.patientcheck1 = false;
    this.patientcheck2 = false;
    this.patientcheck3 = false;
    this.patientcheck4 = false;
    this.patientcheck5 = false;
    this.patientcheck6 = false;
    this.checkpatient1 = false;
    this.checkpatient2 = false;
  }
  save() {
    let url: string = `nursingcarerecord/save`;
    this.http.doPost(url, this._obj).subscribe(
      (data: any) => {
        if (data.message == "SUCCESS") {
          //alert("Saved Successfully.");
          this.goNew();
        } else if (data.message == "FAIL") {
          //alert("Saving Fail.");

        } else if (data.message == "EXIT") {
          // alert("Saving Fail.");
        } else {
          // alert("Saving Fail.");

        }
      },
      error => {
        //alert("Saving Fail.in in");
      });
  }
  goDelete() {
    let url: string = `nursingcarerecord/delete`;
    this.http.doPost(url, this._obj).subscribe(
      (data: any) => {
        if (data.message == "Success") {
          // alert("Delete Successfully.");
          this.goNew();

        } else if (data.message == "deleteFail") {
          // alert("Delete Fail.");
        } else {
          // alert("Delete Fail .");
        }
      },
      error => {
        //alert("Delete Fail .");

      }
    );
  }
  getNurse() {
    let url: string = `nursingcarerecord/get`;
    this.http.doPost(url, { syskey: this.instructionStoreService._syskey }).subscribe(
      (data: any) => {
        this._obj = data.NurseList[0];
      },
    );
  }
  getRelationship() {
    let url: string = `nursingcarerecord/getrelationship`;
    this.http.doPost(url, this._rsobj).subscribe(
      (data: any) => {
        this._rsobj = data.NurseList;
      },
    );
  }
  statechange() { }
  print() {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('ASIA ROYAL HOSPITAL', 105, 5, { align: 'center' });
    doc.text('NURSING SHIFT SUMMARY', 105, 13, { align: 'center' });
    doc.setFontSize(10);
    doc.rect(5, 17, 93, 18);
    doc.text('Patient`s Sticky Label', 25, 26);
    doc.rect(100, 17, 105, 18);
    doc.line(100, 23, 205, 23);
    doc.line(153, 17, 153, 35);
    doc.text('Ward', 120, 21);
    doc.text('Room/Bed', 170, 21);
    doc.rect(5, 37, 200, 18);
    doc.text('Patient`s Sticky Label', 25, 26);
    doc.text('Non-Drug Allergies(Food,Skin,Others)Pls Specify', 6, 42);
    doc.rect(5, 57, 200, 103);
    doc.rect(5, 57, 200, 8);
    doc.text('INSTRUCTIONS', 105, 62, { align: 'center' });
    doc.text('1. The Nurse is responsible to ensure that initial assessment is done within one hour and full assessment', 6, 70);
    doc.text('     and care planning is done within 24 hours of patient`s admission. ', 6, 75);
    doc.text('2. The Nursing Care Record (NCR) shall be used to assess and plan the appropriate nursing care for all patients.', 6, 80);
    doc.text('3. The activities of daily living are adapted from the Roper, Tierney and Logan Model and patient care is', 6, 85);
    doc.text('      planned using the nursing process to ensure total care delivery.', 6, 90);
    doc.text('4. In accordance to the guidelines on nursing documentation, this record has to be completed, legibly dated and signed. ', 6, 95);
    doc.text('5. This record should be readly available to all healthcare professionals responsible for the care of the patient. ', 6, 100);
    doc.text('6. For section where boxes are used place a tick (  Checkmark ) in the box (Smart Phone) as applicable. ', 6, 105);
    doc.text('7. Where a choice has to be made from a given list of words separated with an oblique line (    ) or / or', 6, 110);
    doc.text('      (*)  delete the non-appropriate word(s) (e.g. Relative/ Friend/ Police*) ', 6, 115);
    doc.text('8. On pages 8-13 ', 6, 120);
    doc.text('       * Write the dates in the appropriate column. ', 6, 125);
    doc.text('       * Indicate NA on blank lines if intervention is not required or problem is not identified. ', 6, 130);
    doc.text('       * Place (Checkmark) if intervention is performed. ', 6, 135);
    doc.text('                 (Close)  if  intervention is not performed.', 6, 140);
    doc.text('                   (R) refer to documentation in other charts and/or Progress Notes. ', 6, 145);
    doc.text('* Conduct a daily assessment and evaluate the care plan, if the nursing intervention is resolved,  ', 6, 150);
    doc.text('       indicate date in the outcome column. ', 6, 155);
    doc.rect(5, 162, 200, 122);
    doc.rect(5, 162, 200, 8);
    doc.text('PERSON TO CONTACT IN EMERGENCY', 105, 167, { align: 'center' });
    doc.text('Name in Full:', 6, 175);
    doc.line(28, 175, 95, 175);
    doc.text(this._obj.t1, 33, 175);
    doc.text('Relationship:', 100, 175);
    doc.line(122, 175, 202, 175);
    doc.text('Phone(Res):', 6, 180);
    doc.text(this._obj.phone1, 30, 180);
    doc.line(28, 180, 67, 180);
    doc.text('(Off)', 72, 180);
    doc.text(this._obj.phone2, 82, 180);
    doc.line(80, 180, 112, 180);
    doc.text('(HP)', 117, 180);
    doc.text(this._obj.phone3, 127, 180);
    doc.line(125, 180, 157, 180);
    doc.text('(HP)', 162, 180);
    doc.text(this._obj.phone4, 172, 180);
    doc.line(170, 180, 202, 180);
    doc.text('Name:', 6, 185);
    doc.text(this._obj.t2, 23, 185);
    doc.line(18, 185, 95, 185);
    doc.text('Relationship:', 100, 185);
    doc.line(122, 185, 202, 185);
    doc.text('Phone(Res):', 6, 190);
    doc.text(this._obj.phone5, 30, 190);
    doc.line(28, 190, 67, 190);
    doc.text('(Off)', 72, 190);
    doc.text(this._obj.phone6, 82, 190);
    doc.line(80, 190, 112, 190);
    doc.text('(HP)', 117, 190);
    doc.text(this._obj.phone7, 127, 190);
    doc.line(125, 190, 157, 190);
    doc.text('(HP)', 162, 190);
    doc.text(this._obj.phone8, 172, 190);
    doc.line(170, 190, 202, 190);
    doc.rect(5, 193, 200, 8);
    doc.text('PRIMARY DECISION MAKER', 105, 198, { align: 'center' });
    doc.text('Name:', 6, 206);
    doc.text(this._obj.t3, 23, 206);
    doc.line(18, 206, 95, 206);
    doc.text('Relationship:', 100, 206);
    doc.line(122, 206, 202, 206);
    doc.text('Phone(Res):', 6, 211);
    doc.text(this._obj.phone9, 30, 211);
    doc.line(28, 211, 67, 211);
    doc.text('(Off)', 72, 211);
    doc.text(this._obj.phone10, 82, 211);
    doc.line(80, 211, 112, 211);
    doc.text('(HP)', 117, 211);
    doc.text(this._obj.phone11, 127, 211);
    doc.line(125, 211, 157, 211);
    doc.text('(HP)', 162, 211);
    doc.text(this._obj.phone12, 172, 211);
    doc.line(170, 211, 202, 211);
    doc.rect(5, 214, 200, 8);
    doc.text('SECONDARY DECISION MAKER', 105, 219, { align: 'center' });
    doc.text('Name:', 6, 227);
    doc.text(this._obj.t4, 23, 227);
    doc.line(18, 227, 95, 227);
    doc.text('Relationship:', 100, 227);
    doc.line(122, 227, 202, 227);
    doc.text('Phone(Res):', 6, 232);
    doc.text(this._obj.phone13, 30, 232);
    doc.line(28, 232, 67, 232);
    doc.text('(Off)', 72, 232);
    doc.text(this._obj.phone14, 82, 232);
    doc.line(80, 232, 112, 232);
    doc.text('(HP)', 117, 232);
    doc.text(this._obj.phone15, 127, 232);
    doc.line(125, 232, 157, 232);
    doc.text('(HP)', 162, 232);
    doc.text(this._obj.phone16, 172, 232);
    doc.line(170, 232, 202, 232);
    doc.rect(5, 235, 200, 8);
    doc.text('ADMISSION ASSESSMENT', 105, 240, { align: 'center' });
    doc.text('Patient Admitted From:', 6, 248);
    doc.rect(45, 245, 6, 4);
    doc.text('A&E', 53, 248);
    doc.rect(65, 245, 6, 4);
    doc.text('OPD', 73, 248);
    doc.rect(85, 245, 6, 4);
    doc.text('Trolley', 92, 248);
    doc.rect(111, 245, 6, 4);
    doc.text('Wheel chair', 119, 248);
    doc.rect(144, 245, 6, 4);
    doc.text('Walking', 152, 248);
    doc.rect(45, 250, 6, 4);
    doc.text('Others', 53, 253);
    doc.line(70, 253, 155, 253);
    doc.text(this._obj.t8, 75, 253);
    doc.text('Please Specify', 120, 257);
    doc.text('Arrival Time:', 6, 265);
    doc.text(this._obj.t5, 30, 265);
    doc.line(26, 265, 95, 265);
    doc.text('Accompanied By:', 100, 265);
    doc.text(this._obj.t6, 137, 265);
    doc.line(130, 265, 202, 265);
    doc.text('Condition On Arrial:', 6, 270);
    doc.text(this._obj.t7, 49, 270);
    doc.line(45, 270, 202, 270);
    doc.text('Information Received From:', 6, 275);
    doc.rect(50, 272, 6, 4);
    doc.text('Patient', 58, 275);
    doc.rect(78, 272, 6, 4);
    doc.text('Others', 87, 275);
    doc.line(110, 275, 202, 275);
    doc.text(this._obj.t9, 115, 275);
    doc.text('Please Dpecify', 120, 279);
    doc.text('Page 1 of 14', 200, 290, { align: 'right' });
    if (this._obj.n6 == 1) {
      doc.rect(50, 272, 6, 4, "F");
    } else if (this._obj.n6 == 2) {
      doc.rect(78, 272, 6, 4, "F");
    }
    if (this._obj.n5 == 1) {
      doc.rect(45, 245, 6, 4, "F");
    } else if (this._obj.n5 == 2) {
      doc.rect(65, 245, 6, 4, "F");
    } else if (this._obj.n5 == 3) {
      doc.rect(85, 245, 6, 4, "F");
    } else if (this._obj.n5 == 4) {
      doc.rect(111, 245, 6, 4, "F");
    } else if (this._obj.n5 == 5) {
      doc.rect(144, 245, 6, 4, "F");
    } else if (this._obj.n5 == 6) {
      doc.rect(45, 250, 6, 4, "F");
    }
    if (this._obj.n1 == 1) {
      doc.text("Father", 127, 175);
    } else if (this._obj.n1 == 2) {
      doc.text("Mother", 127, 175);
    } else if (this._obj.n1 == 3) {
      doc.text("Husband", 127, 175);
    } else if (this._obj.n1 == 4) {
      doc.text("Wife", 127, 175);
    } else if (this._obj.n1 == 5) {
      doc.text("Son", 127, 175);
    } else if (this._obj.n1 == 6) {
      doc.text("Daughter", 127, 175);
    } else if (this._obj.n1 == 7) {
      doc.text("Sister", 127, 175);
    } else if (this._obj.n1 == 8) {
      doc.text("Brother", 127, 175);
    }
    if (this._obj.n2 == 1) {
      doc.text("Father", 127, 185);
    } else if (this._obj.n2 == 2) {
      doc.text("Mother", 127, 185);
    } else if (this._obj.n2 == 3) {
      doc.text("Husband", 127, 185);
    } else if (this._obj.n2 == 4) {
      doc.text("Wife", 127, 185);
    } else if (this._obj.n2 == 5) {
      doc.text("Son", 127, 185);
    } else if (this._obj.n2 == 6) {
      doc.text("Daughter", 127, 185);
    } else if (this._obj.n2 == 7) {
      doc.text("Sister", 127, 185);
    } else if (this._obj.n2 == 8) {
      doc.text("Brother", 127, 185);
    }
    if (this._obj.n3 == 1) {
      doc.text("Father", 127, 206);
    } else if (this._obj.n3 == 2) {
      doc.text("Mother", 127, 206);
    } else if (this._obj.n3 == 3) {
      doc.text("Husband", 127, 206);
    } else if (this._obj.n3 == 4) {
      doc.text("Wife", 127, 206);
    } else if (this._obj.n3 == 5) {
      doc.text("Son", 127, 206);
    } else if (this._obj.n3 == 6) {
      doc.text("Daughter", 127, 206);
    } else if (this._obj.n3 == 7) {
      doc.text("Sister", 127, 206);
    } else if (this._obj.n3 == 8) {
      doc.text("Brother", 127, 206);
    }
    if (this._obj.n4 == 1) {
      doc.text("Father", 127, 227);
    } else if (this._obj.n4 == 2) {
      doc.text("Mother", 127, 227);
    } else if (this._obj.n4 == 3) {
      doc.text("Husband", 127, 227);
    } else if (this._obj.n4 == 4) {
      doc.text("Wife", 127, 227);
    } else if (this._obj.n4 == 5) {
      doc.text("Son", 127, 227);
    } else if (this._obj.n4 == 6) {
      doc.text("Daughter", 127, 227);
    } else if (this._obj.n4 == 7) {
      doc.text("Sister", 127, 227);
    } else if (this._obj.n4 == 8) {
      doc.text("Brother", 127, 227);
    }
    doc.save('nursingcarerecord.pdf');
  }

}

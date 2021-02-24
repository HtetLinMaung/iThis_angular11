import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';

import { PatientTypeService } from '../patient-type.service';

@Component({
  selector: 'app-patient-type-form',
  templateUrl: './patient-type-form.component.html',
  styleUrls: ['./patient-type-form.component.css']
})
export class PatientTypeFormComponent implements OnInit {

  _obj = this.getObj();
  parentcheck: boolean;
  childcheck: boolean;
  separate_payment: boolean;
  credit: boolean;
  full_payment: boolean;
  export_to_account: boolean;
  constructor(
    private http: HttpService,
    public instructionStoreService: PatientTypeService,
    public appStoreService: AppStoreService,
  ) { }

  ngOnInit(): void {
    this.getPatientType();
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
      t1: "",
      t2: "",
      t3: "",
      t4: "",
      t5: "",
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
      n6: 0,
      n7: 0,
    };
  }
  checkCare(myRadio) {
    if (myRadio == '1')
      //this.parentcheck = true;
      this.childcheck = true;
    else
      //this.childcheck = true;
      this.parentcheck = true;
    this._obj.n1 = +myRadio;

  }
  // SeparatePayment(e, myRadio) {
  //   if (e.target.checked == true, myRadio == '1') {
  //     this.separate_payment = true;
  //   }
  //   else (e.target.checked == false, myRadio == '2')
  //   this.separate_payment = false;
  // this._obj.n2 = +myRadio;
  // }
  SeparatePayment(e) {
    if (e.target.checked) {
      this._obj.n2 = 1;
    }
    else
      this._obj.n2 = 0;

  }
  Credit(e) {
    if (e.target.checked)
      this._obj.n3 = 1;
    else
      this._obj.n3 = 0;
  }
  Full_payment(e) {
    if (e.target.checked)
      this._obj.n4 = 0;
    else
      this._obj.n4 = 1;
  }
  Export(e) {
    if (e.target.checked)
      this._obj.n5 = 1;
    else
      this._obj.n5 = 0;
  }

  goNew() {
    this._obj = this.getObj();
    this.childcheck = false;
    this.parentcheck = false;
    this.credit = false;
    this.export_to_account = false;
    this.separate_payment = false;
    this.full_payment = false;
  }
  save() {
    let url: string = `patienttype/save`;
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
    this.instructionStoreService.deleteDialog = true;
    this.instructionStoreService._syskey = this._obj;
  }
  getPatientType() {
    let url: string = `patienttype/get`;
    this.http.doPost(url, { syskey: this.instructionStoreService._syskey }).subscribe(
      (data: any) => {
        this._obj = data.PatientTypeList[0];
      },
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { CommonTypeService } from '../common-type.service';

@Component({
  selector: 'app-common-type-form',
  templateUrl: './common-type-form.component.html',
  styleUrls: ['./common-type-form.component.css']
})
export class CommonTypeFormComponent implements OnInit {

  _obj = this.getObj();
  constructor(
    private http: HttpService,
    public instructionStoreService: CommonTypeService,
    public appStoreService: AppStoreService,
  ) { }

  ngOnInit(): void {
    this.goNew();
    this.getCommonType();
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
      type: 0,
      code: "",
      description: "",
    };

  }
  goNew() {
    this._obj = this.getObj();
  }
  save() {
    let url: string = `commontype/save`;
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
    let url: string = `commontype/delete`;
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
  getCommonType() {
    let url: string = `commontype/get`;
    this.http.doPost(url, { syskey: this.instructionStoreService._syskey }).subscribe(
      (data: any) => {
        this._obj = data.NurseList[0];
      },
    );
  }
  print() { }

}

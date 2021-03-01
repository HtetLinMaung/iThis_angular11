import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';

import { RoomcodeService } from '../roomcode.service';

@Component({
  selector: 'app-roomcode-form',
  templateUrl: './roomcode-form.component.html',
  styleUrls: ['./roomcode-form.component.css']
})
export class RoomcodeFormComponent implements OnInit {

  _obj = this.getObj();
  constructor(
    private http: HttpService,
    public instructionStoreService: RoomcodeService,
    public appStoreService: AppStoreService,
  ) { }

  ngOnInit(): void {
    this.getRoomType();
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
    };
  }
  goNew() {
    this._obj = this.getObj();
  }
  save() {
    let url: string = `roomcode/save`;
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
  getRoomType() {
    let url: string = `roomcode/get`;
    this.http.doPost(url, { syskey: this.instructionStoreService._syskey }).subscribe(
      (data: any) => {
        this._obj = data.RoomCodeList[0];
      },
    );
  }
}

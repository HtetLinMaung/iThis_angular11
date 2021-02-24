import { Component, OnInit } from '@angular/core';

import { HttpService } from '../framework/http.service';
import { RoomcodeService } from './roomcode.service';

@Component({
  selector: 'app-roomcode',
  templateUrl: './roomcode.component.html',
  styleUrls: ['./roomcode.component.css']
})
export class RoomcodeComponent implements OnInit {

  syskey = this.getSyskey();
  constructor(
    private http: HttpService,
    public instructionStoreService: RoomcodeService
  ) { }

  ngOnInit(): void {
    this.tabClickHandler(1);
  }
  tabClickHandler(n: number) {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    switch (n) {
      case 1:
        tabEle1.style.background = '#3b5998';
        tabEle2.style.background = '#8C9899';
        break;
      default:
        tabEle2.style.background = '#3b5998';
        tabEle1.style.background = '#8C9899';
        this.instructionStoreService._syskey = this.syskey;
    }
    this.instructionStoreService.tabNo = n;
  }
  getSyskey() {
    return {
      syskey: "",
    };
  }
  deleteData() {

    this.instructionStoreService.deleteDialog = true;
    let url: string = `roomcode/delete`;
    this.http.doPost(url, this.instructionStoreService._syskey).subscribe(
      (data: any) => {
        if (data.message == "Success") {
          // this.goNew();
          const tabEle1 = document.getElementById('tab1');
          const tabEle2 = document.getElementById('tab2');
          tabEle1.style.background = '#3b5998';
          tabEle2.style.background = '#8C9899';
          this.instructionStoreService.tabNo = 1;
          this.instructionStoreService.deleteDialog = false;


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
  cancelDelete() {
    this.instructionStoreService.deleteDialog = false;
  }

}

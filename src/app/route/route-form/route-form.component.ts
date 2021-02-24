import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';

import { RouteModule } from '../route.module';
import { RouteService } from '../route.service';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.css']
})
export class RouteFormComponent implements OnInit {

  _obj = this.getObj();
  constructor(
    private http: HttpService,
    public instructionStoreService: RouteService,
    public appStoreService: AppStoreService,
  ) {
  }

  ngOnInit(): void {
    this.goNew();
    this.getCommonType();
  }
  getObj() {
    return {
      syskey: "",
      route: "",
      engDesc: "",
      myanDesc: "",
      stockInitial: "",
    };

  }
  goNew() {
    this._obj = this.getObj();
  }
  save() {
    let url: string = `route/save`;
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
    this.instructionStoreService._syskey = this._obj
  }
  getCommonType() {
    let url: string = `route/get`;
    this.http.doPost(url, { syskey: this.instructionStoreService._syskey }).subscribe(
      (data: any) => {
        this._obj = data.RouteList[0];
      },
    );
  }
  print() { }


}

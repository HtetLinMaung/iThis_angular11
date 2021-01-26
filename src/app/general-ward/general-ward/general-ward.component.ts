import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { GeneralWardStoreService } from '../general-ward-store.service';

@Component({
  selector: 'app-general-ward',
  templateUrl: './general-ward.component.html',
  styleUrls: ['./general-ward.component.css'],
})
export class GeneralWardComponent implements OnInit {
  constructor(
    public appStoreService: AppStoreService,
    public generalWardStoreService: GeneralWardStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {}

  tabClickHandler(n: number) {
    this.generalWardStoreService.tabNo = n;
  }

  deleteData() {
    this.generalWardStoreService.deleteDialog = false;
    if (this.generalWardStoreService.isUpdate) {
      // this.http
      //   .doPost(
      //     `inpatient-medical-record/delete-blood/${this.generalWardStoreService.currentSysKey}`,
      //     { syskey: this.generalWardStoreService.currentSysKey }
      //   )
      //   .subscribe((data) => {
      //     this.generalWardStoreService.isUpdate = false;
      //     this.generalWardStoreService.tabNo = 1;
      //   });
    }
  }

  cancelDelete() {
    this.generalWardStoreService.deleteDialog = false;
  }
}

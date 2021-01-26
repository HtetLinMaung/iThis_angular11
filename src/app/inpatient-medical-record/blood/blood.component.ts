import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';

import { BloodStoreService } from './blood-store.service';

@Component({
  selector: 'app-blood',
  templateUrl: './blood.component.html',
  styleUrls: ['./blood.component.css'],
})
export class BloodComponent implements OnInit {
  constructor(
    public appStoreService: AppStoreService,
    public bloodStoreService: BloodStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {}

  tabClickHandler(n: number) {
    this.bloodStoreService.tabNo = n;
  }

  deleteData() {
    this.bloodStoreService.deleteDialog = false;
    if (this.bloodStoreService.isUpdate) {
      this.http
        .doPost(
          `inpatient-medical-record/delete-blood/${this.bloodStoreService.currentSysKey}`,
          { syskey: this.bloodStoreService.currentSysKey }
        )
        .subscribe((data) => {
          this.bloodStoreService.isUpdate = false;
          this.bloodStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.bloodStoreService.deleteDialog = false;
  }

  // this is for dev only
  toggleRank() {
    this.appStoreService.isDoctorRank = !this.appStoreService.isDoctorRank;
  }
}

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { NonParenteralStoreService } from './non-parenteral-store.service';

@Component({
  selector: 'app-non-parenteral',
  templateUrl: './non-parenteral.component.html',
  styleUrls: ['./non-parenteral.component.css'],
})
export class NonParenteralComponent implements OnInit {
  constructor(
    public appStoreService: AppStoreService,
    public nonParenteralStoreService: NonParenteralStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {}

  tabClickHandler(n: number) {
    this.nonParenteralStoreService.tabNo = n;
  }

  deleteData() {
    this.nonParenteralStoreService.deleteDialog = false;
    if (this.nonParenteralStoreService.isUpdate) {
      this.http
        .doPost(
          `inpatient-medical-record/delete-non-parenteral/${this.nonParenteralStoreService.currentSysKey}`,
          { syskey: this.nonParenteralStoreService.currentSysKey }
        )
        .subscribe((data) => {
          this.nonParenteralStoreService.isUpdate = false;
          this.nonParenteralStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.nonParenteralStoreService.deleteDialog = false;
  }

  // this is for dev only
  toggleRank() {
    this.appStoreService.isDoctorRank = !this.appStoreService.isDoctorRank;
  }
}

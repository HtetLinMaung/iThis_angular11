import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { InjectionStoreService } from './injection-store.service';

@Component({
  selector: 'app-injection',
  templateUrl: './injection.component.html',
  styleUrls: ['./injection.component.css'],
})
export class InjectionComponent implements OnInit {
  constructor(
    public appStoreService: AppStoreService,
    public injectionStoreService: InjectionStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {}

  tabClickHandler(n: number) {
    this.injectionStoreService.tabNo = n;
  }

  deleteData() {
    this.injectionStoreService.deleteDialog = false;
    if (this.injectionStoreService.isUpdate) {
      this.http
        .doPost(
          `inpatient-medical-record/delete-injection/${this.injectionStoreService.currentSysKey}`,
          { syskey: this.injectionStoreService.currentSysKey }
        )
        .subscribe((data) => {
          this.injectionStoreService.isUpdate = false;
          this.injectionStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.injectionStoreService.deleteDialog = false;
  }

  // this is for dev only
  toggleRank() {
    this.appStoreService.isDoctorRank = !this.appStoreService.isDoctorRank;
  }
}

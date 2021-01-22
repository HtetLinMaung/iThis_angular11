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
      // this.http
      //   .doPost(
      //     `inpatient-medical-record/delete-instruction/${this.instructionStoreService.currentSysKey}`,
      //     { syskey: this.instructionStoreService.currentSysKey }
      //   )
      //   .subscribe((data) => {
      //     const tabEle1 = document.getElementById('tab1');
      //     const tabEle2 = document.getElementById('tab2');
      //     tabEle1.style.background = '#3b5998';
      //     tabEle2.style.background = '#8C9899';
      //     this.instructionStoreService.isUpdate = false;
      //     this.instructionStoreService.tabNo = 1;
      //   });
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

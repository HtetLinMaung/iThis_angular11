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
    }
    this.nonParenteralStoreService.tabNo = n;
  }

  deleteData() {
    this.nonParenteralStoreService.deleteDialog = false;
    if (this.nonParenteralStoreService.isUpdate) {
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
    this.nonParenteralStoreService.deleteDialog = false;
  }

  // this is for dev only
  toggleRank() {
    this.appStoreService.isDoctorRank = !this.appStoreService.isDoctorRank;
  }
}

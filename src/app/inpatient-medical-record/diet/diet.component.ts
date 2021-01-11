import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { DietStoreService } from './diet-store.service';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css'],
})
export class DietComponent implements OnInit {
  constructor(
    public appStoreService: AppStoreService,
    public dietStoreService: DietStoreService,
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
    this.dietStoreService.tabNo = n;
  }

  deleteData() {
    this.dietStoreService.deleteDialog = false;
    if (this.dietStoreService.isUpdate) {
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
    this.dietStoreService.deleteDialog = false;
  }

  // this is for dev only
  toggleRank() {
    this.appStoreService.isDoctorRank = !this.appStoreService.isDoctorRank;
  }
}

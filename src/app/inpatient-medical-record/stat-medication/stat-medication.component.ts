import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { StatMedicationStoreService } from './stat-medication-store.service';

@Component({
  selector: 'app-stat-medication',
  templateUrl: './stat-medication.component.html',
  styleUrls: ['./stat-medication.component.css'],
})
export class StatMedicationComponent implements OnInit {
  constructor(public statMedicationStoreService: StatMedicationStoreService, private http: HttpService) {}

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
    this.statMedicationStoreService.tabNo = n;
  }

  deleteData() {
    this.statMedicationStoreService.deleteDialog = false;
    if (this.statMedicationStoreService.isUpdate) {
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
    this.statMedicationStoreService.deleteDialog = false;
  }
}

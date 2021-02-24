import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { InstructionStoreService } from './instruction-store.service';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent implements OnInit {
  constructor(
    public appStoreService: AppStoreService,
    private http: HttpService,
    public instructionStoreService: InstructionStoreService
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
    this.instructionStoreService.tabNo = n;
  }

  deleteData() {
    this.instructionStoreService.deleteDialog = false;
    if (this.instructionStoreService.isUpdate) {
      this.http
        .doPost(
          `inpatient-medical-record/delete-instruction/${this.instructionStoreService.currentSysKey}`,
          { syskey: this.instructionStoreService.currentSysKey }
        )
        .subscribe((data) => {
          const tabEle1 = document.getElementById('tab1');
          const tabEle2 = document.getElementById('tab2');
          tabEle1.style.background = '#3b5998';
          tabEle2.style.background = '#8C9899';

          this.instructionStoreService.isUpdate = false;
          this.instructionStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.instructionStoreService.deleteDialog = false;
  }
}

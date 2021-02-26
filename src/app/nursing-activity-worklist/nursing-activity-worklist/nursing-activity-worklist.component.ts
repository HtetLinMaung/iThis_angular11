import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { NurseActivityWorkListStoreService } from '../nurse-activity-work-list-store.service';

@Component({
  selector: 'app-nursing-activity-worklist',
  templateUrl: './nursing-activity-worklist.component.html',
  styleUrls: ['./nursing-activity-worklist.component.css'],
})
export class NursingActivityWorklistComponent implements OnInit {
  constructor(
    public appStoreService: AppStoreService,
    public nurseActivityWorkListStoreService: NurseActivityWorkListStoreService,
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
    this.nurseActivityWorkListStoreService.tabNo = n;
  }

  deleteData() {
    this.nurseActivityWorkListStoreService.deleteDialog = false;
    if (this.nurseActivityWorkListStoreService.isUpdate) {
      this.http
        .doPost(
          `nurse-activity-worklist/delete/${this.nurseActivityWorkListStoreService.currentSysKey}`,
          { syskey: this.nurseActivityWorkListStoreService.currentSysKey }
        )
        .subscribe(
          (data) => {
            const tabEle1 = document.getElementById('tab1');
            const tabEle2 = document.getElementById('tab2');
            tabEle1.style.background = '#3b5998';
            tabEle2.style.background = '#8C9899';

            this.nurseActivityWorkListStoreService.isUpdate = false;
            this.nurseActivityWorkListStoreService.tabNo = 1;
          },
          (error) => {},
          () => {}
        );
    }
  }

  cancelDelete() {
    this.nurseActivityWorkListStoreService.deleteDialog = false;
  }
}

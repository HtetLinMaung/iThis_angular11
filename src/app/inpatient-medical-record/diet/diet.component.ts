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
    this.dietStoreService.tabNo = n;
  }

  deleteData() {
    this.dietStoreService.deleteDialog = false;
    if (this.dietStoreService.isUpdate) {
      this.http
        .doPost(
          `inpatient-medical-record/delete-diet/${this.dietStoreService.currentSysKey}`,
          { syskey: this.dietStoreService.currentSysKey }
        )
        .subscribe((data) => {
          this.dietStoreService.isUpdate = false;
          this.dietStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.dietStoreService.deleteDialog = false;
  }
}

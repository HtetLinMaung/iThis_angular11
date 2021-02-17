import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { ButtonStoreService } from './button-store.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  constructor(
    private http: HttpService,
    public buttonStoreService: ButtonStoreService
  ) {}

  ngOnInit(): void {}

  tabClickHandler(n: number) {
    this.buttonStoreService.tabNo = n;
  }

  deleteData() {
    this.buttonStoreService.deleteDialog = false;
    if (this.buttonStoreService.isUpdate) {
      this.http
        .doPost(`menu/button/delete/${this.buttonStoreService.currentSysKey}`, {
          syskey: this.buttonStoreService.detailSyskey,
        })
        .subscribe((data) => {
          this.buttonStoreService.isUpdate = false;
          this.buttonStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.buttonStoreService.deleteDialog = false;
  }
}

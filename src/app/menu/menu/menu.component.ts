import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { MenuStoreService } from './menu-store.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  constructor(
    private http: HttpService,
    public menuStoreService: MenuStoreService
  ) {}

  ngOnInit(): void {}

  tabClickHandler(n: number) {
    this.menuStoreService.tabNo = n;
  }

  deleteData() {
    this.menuStoreService.deleteDialog = false;
    if (this.menuStoreService.isUpdate) {
      this.http
        .doPost(`menu/menu/delete/${this.menuStoreService.currentSysKey}`, {
          syskey: this.menuStoreService.detailSyskey,
        })
        .subscribe((data) => {
          this.menuStoreService.isUpdate = false;
          this.menuStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.menuStoreService.deleteDialog = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { RouteService } from '../route.service';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit {

  _obj = this.getObj();
  _RouteList = this.getObj();
  search = '';
  page = 1;
  perPage = 10;
  start = 0;
  end = 0;
  totalPage = 0;
  total = 0;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  constructor(
    public instructionStoreService: RouteService,
    private http: HttpService,
  ) { }

  ngOnInit(): void {
    this.getCommonType();
  }
  initPagination(data) {
    this.start = 0;
    this.end = this.perPage;
    if (data.length < this.perPage) {
      this.end = data.length;
    }
    this.calculateTotal(data);
  }
  calculateTotal(data) {
    this.totalPage = Math.ceil(data.length / this.perPage);
    this.total = data.length;
  }
  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.instructionStoreService.instructions);
  }
  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end =
              this.instructionStoreService.instructions.length - this.start;
          }
          this.start = (this.page - 1) * this.perPage;
        }
        break;
      case 2:
        if (this.page !== 1) {
          this.page--;
          this.end = this.page * this.perPage;
          this.start = (this.page - 1) * this.perPage;
        } else {
          this.start = (this.page - 1) * this.perPage;
          this.end = this.perPage;
          if (this.instructionStoreService.instructions.length < this.perPage) {
            this.end = this.instructionStoreService.instructions.length;
          }
        }
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (this.instructionStoreService.instructions.length < this.perPage) {
          this.end = this.instructionStoreService.instructions.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (
          this.instructionStoreService.instructions.length % this.perPage ===
          0
        ) {
          this.end = this.page * this.perPage;
        } else {
          this.end =
            this.start +
            (this.instructionStoreService.instructions.length % this.perPage);
        }
    }
  }
  normalSearch() {
    this.getCommonType();
  }
  showAll() {
    this._obj.route = "";
    this._obj.engDesc = "";
    this._obj.myanDesc = "";
    this._obj.stockInitial = "";
    this.getCommonType();
  }
  clearSearch() {
    this._obj.route = "";
    this._obj.engDesc = "";
    this._obj.myanDesc = "";
    this._obj.stockInitial = "";
    this.getCommonType();
  }
  openAdvSearch() {
    this.getCommonType();
  }
  //framework
  getObj() {
    return {
      syskey: "",
      route: "",
      engDesc: "",
      myanDesc: "",
      stockInitial: "",
    };

  }
  getCommonType() {
    let url: string = `route/get`;
    this.http.doPost(url, this._obj).subscribe(
      (data: any) => {
        this._RouteList = data.RouteList;
      },
    );
  }
  detail({ syskey }) {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    this.instructionStoreService._syskey = syskey;
    this.instructionStoreService.tabNo = 2;
  }


}

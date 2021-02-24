import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { PatientTypeService } from '../patient-type.service';

@Component({
  selector: 'app-patient-type-list',
  templateUrl: './patient-type-list.component.html',
  styleUrls: ['./patient-type-list.component.css']
})
export class PatientTypeListComponent implements OnInit {
  search = '';
  page = 1;
  perPage = 10;
  start = 0;
  end = 0;
  totalPage = 0;
  total = 0;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  _patienttypeObj = this.getObj();
  _patienttypeList = this.getObj();
  constructor(
    public instructionStoreService: PatientTypeService,
    private http: HttpService,
  ) { }

  ngOnInit(): void {
    this.getPatientType();
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
  getObj() {
    return {
      syskey: "",
      autokey: 0,
      createddate: "",
      modifieddate: "",
      userid: "",
      username: "",
      RecordStatus: 0,
      SyncStatus: 0,
      SyncBatch: 0,
      usersyskey: 0,
      parentid: 0,
      t1: "",
      t2: "",
      t3: "",
      t4: "",
      t5: "",
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0,
      n5: 0,
      n6: 0,
      n7: 0,
    };
  }
  detail({ syskey }) {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    this.instructionStoreService._syskey = syskey;
    this.instructionStoreService.isUpdate = true;
    this.instructionStoreService.tabNo = 2;
  }
  getPatientType() {
    let url: string = `patienttype/get`;
    this.http.doPost(url, this._patienttypeObj).subscribe(
      (data: any) => {
        this._patienttypeList = data.PatientTypeList;
      },
    );
  }
  normalSearch() {
    this.getPatientType();
  }
  showAll() {
    this._patienttypeObj.t1 = "";
    this._patienttypeObj.t2 = "";
    this.getPatientType();
  }
  clearSearch() {
    this._patienttypeObj.t1 = "";
    this._patienttypeObj.t2 = "";
    this.getPatientType();
  }
  openAdvSearch() { }

}

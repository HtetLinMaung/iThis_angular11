import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { NonParenteralStoreService } from '../non-parenteral-store.service';
import * as moment from 'moment';
import NonParenteral, { CheckList } from '../non-parenteral.model';
import CommonUtil from 'src/app/utils/common.util';

@Component({
  selector: 'app-non-parenteral-list',
  templateUrl: './non-parenteral-list.component.html',
  styleUrls: ['./non-parenteral-list.component.css'],
})
export class NonParenteralListComponent extends CommonUtil implements OnInit {
  headers = [
    'Patient ID',
    'Ad No',
    'Patient Name',
    'Route',
    'Medication',
    'Dose',
    'Dose Type',
    'Remark',
    'Frequency',
  ];
  fields = [
    {
      text: 'Route',
      value: '1',
      key: 'routeDesc',
    },
    {
      text: 'Medication',
      value: '2',
      key: 'medication',
    },
    {
      text: 'Dose',
      value: '3',
      key: 'dose',
    },
    {
      text: 'Dose Type',
      value: '4',
      key: 'doseTypeDesc',
    },
    {
      text: 'Remark',
      value: '5',
      key: 'remark',
    },
    {
      text: 'Frequency',
      value: '6',
      key: 'frequency',
    },
    {
      text: 'Patient ID',
      value: '7',
      key: 'patientId',
    },
    {
      text: 'Patient Name',
      value: '8',
      key: 'patientName',
    },
    {
      text: 'Ad No',
      value: '9',
      key: 'adNo',
    },
  ];

  constructor(
    public appStoreService: AppStoreService,
    public nonParenteralStoreService: NonParenteralStoreService,
    private http: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle1.style.background = '#3b5998';
    tabEle2.style.background = '#8C9899';
    this.fetchAllNonParenterals();
    this.nonParenteralStoreService.isUpdate = false;
  }

  async fetchAllNonParenterals() {
    await this.fetchRouteDoseTaskAsync(
      this.http,
      this.nonParenteralStoreService
    );
    this.http
      .doPost(`inpatient-medical-record/non-parenterals`, {
        page: this.page,
        perPage: this.perPage,
        search: this.search,
        advSearch: this.filters.map((filter) => ({
          ...filter,
          field: this.fields.find((v) => v.value == filter.field)?.key,
        })),
      })
      .subscribe((data: any) => {
        this.nonParenteralStoreService.nonParenterals = data.data.map((v) => ({
          ...v,
          routeDesc: this.nonParenteralStoreService.routes.find(
            (route) => route.syskey == v.routeSyskey
          ).text,
          doseTypeDesc: this.nonParenteralStoreService.doses.find(
            (dose) => dose.syskey == v.doseTypeSyskey
          ).text,
          frequency: v.checkList.filter((item) => item.done).length,
        }));

        this.initPagination(data);
      });
  }

  goToList({ syskey }: { syskey: number }) {
    this.nonParenteralStoreService.currentSysKey = syskey;
    this.nonParenteralStoreService.isUpdate = true;
    this.nonParenteralStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.page = 1;
    this.perPage = perPage;
    this.fetchAllNonParenterals();
  }

  handleSkip(n: number) {
    this.calculateSkipType(n);
    this.fetchAllNonParenterals();
  }

  advanceSearch(filters) {
    this.filters = filters;
    this.fetchAllNonParenterals();
  }

  normalSearch() {
    this.fetchAllNonParenterals();
  }

  showAll() {
    this.search = '';
    this.filters = [];
    this.fetchAllNonParenterals();
  }
}

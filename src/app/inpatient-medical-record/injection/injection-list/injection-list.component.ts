import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { InjectionStoreService } from '../injection-store.service';
import * as moment from 'moment';
import Injection from '../Injection.model';
import { CheckList } from '../../non-parenteral/non-parenteral.model';
import CommonUtil from 'src/app/utils/common.util';

@Component({
  selector: 'app-injection-list',
  templateUrl: './injection-list.component.html',
  styleUrls: ['./injection-list.component.css'],
})
export class InjectionListComponent extends CommonUtil implements OnInit {
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
    public injectionStoreService: InjectionStoreService,
    private http: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle1.style.background = '#3b5998';
    tabEle2.style.background = '#8C9899';

    this.fetchAllInjections();
    this.injectionStoreService.isUpdate = false;
  }

  async fetchAllInjections() {
    await this.fetchRouteDoseTaskAsync(this.http, this.injectionStoreService);
    this.http
      .doPost('inpatient-medical-record/injections', {
        page: this.page,
        perPage: this.perPage,
        search: this.search,
        advSearch: this.filters.map((filter) => ({
          ...filter,
          field: this.fields.find((v) => v.value == filter.field)?.key,
        })),
      })
      .subscribe((data: any) => {
        this.injectionStoreService.injections = data.data.map((v) => ({
          ...v,
          frequency: v.checkList.filter((item) => item.done).length,
          routeDesc: this.injectionStoreService.routes.find(
            (route) => route.syskey == v.routeSyskey
          ).text,
          doseTypeDesc: this.injectionStoreService.doses.find(
            (dose) => dose.syskey == v.doseTypeSyskey
          ).text,
        }));

        this.initPagination(data);
      });
  }

  goToList({ syskey }: { syskey: number }) {
    this.injectionStoreService.currentSysKey = syskey;
    this.injectionStoreService.isUpdate = true;
    this.injectionStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.page = 1;
    this.perPage = perPage;
    this.fetchAllInjections();
  }

  handleSkip(n: number) {
    this.calculateSkipType(n);
    this.fetchAllInjections();
  }

  advanceSearch(filters) {
    this.filters = filters;
    this.fetchAllInjections();
  }

  normalSearch() {
    this.fetchAllInjections();
  }

  showAll() {
    this.search = '';
    this.filters = [];
    this.fetchAllInjections();
  }
}

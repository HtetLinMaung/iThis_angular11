import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import CommonUtil from 'src/app/utils/common.util';
import { GeneralWardStoreService } from '../../general-ward-store.service';
import GeneralWard from '../general-ward.model';

@Component({
  selector: 'app-general-ward-list',
  templateUrl: './general-ward-list.component.html',
  styleUrls: ['./general-ward-list.component.css'],
})
export class GeneralWardListComponent extends CommonUtil implements OnInit {
  Type = {
    50: { problemName: 'Breathing', icon: 'fa-lungs' },
    51: { problemName: 'Circulation', icon: 'fa-heartbeat' },
    52: { problemName: 'Communications', icon: 'fa-brain' },
    53: { problemName: 'Comfort', icon: 'fa-smile' },
    54: { problemName: 'Temperature', icon: 'fa-temperature-high' },
    55: { problemName: 'Nutrition', icon: 'fa-lemon' },
    56: { problemName: 'Elimination', icon: 'fa-stethoscope' },
    57: { problemName: 'Resting & Sleeping', icon: 'fa-bed' },
    58: { problemName: 'Risk for fall/ Injury', icon: 'fa-user-injured' },
    59: { problemName: 'Mobilising', icon: 'fa-wheelchair' },
    60: { problemName: 'Personal Hygiene & Skin Care', icon: 'fa-hands-wash' },
    61: { problemName: 'Wound Care', icon: 'fa-first-aid' },
    62: {
      problemName: 'Additional Care Activities',
      icon: 'fa-hand-holding-medical',
    },
    63: { problemName: 'Discharge Activities', icon: 'fa-notes-medical' },
  };
  headers = [
    'Patient ID',
    'Ad No',
    'Patient Name',
    'Intervention',
    'Type',
    'Initial Date',
    'Outcome Met',
    'Outcome Met At',
    '',
    // 'Day Nurse Approved at',
    // 'Night Nurse Approved at',
  ];
  innerHeaders = [
    'Day',
    'Day Nurse',
    'Day At',
    'Night',
    'Night Nurse',
    'Night At',
  ];
  fields = [
    {
      text: 'Intervention',
      value: '1',
      key: 'c.description',
    },
    {
      text: 'Type',
      value: '2',
      key: 'l.n1',
    },
    {
      text: 'Initial Date',
      value: '3',
      key: 'l.t1',
    },
    {
      text: 'Outcome Met',
      value: '4',
      key: 'l.n2',
    },
    {
      text: 'Outcome Met At',
      value: '5',
      key: 'l.t2',
    },
    // {
    //   text: 'Day Nurse Approved at',
    //   value: '5',
    //   key: 'fmtDayAt',
    // },
    // {
    //   text: 'Night Nurse Approved at',
    //   value: '6',
    //   key: 'fmtNightAt',
    // },
    {
      text: 'Patient ID',
      value: '6',
      key: '"v.patientid',
    },
    {
      text: 'Patient Name',
      value: '7',
      key: 'v.RgsName',
    },
    {
      text: 'Ad No',
      value: '8',
      key: 'v.RefNo',
    },
  ];
  shifts = [];

  constructor(
    public appStoreService: AppStoreService,
    public generalWardStoreService: GeneralWardStoreService,
    private http: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle1.style.background = '#3b5998';
    tabEle2.style.background = '#8C9899';
    this.fetchAllGeneralWards();
    this.generalWardStoreService.isUpdate = false;
  }

  formatDate(dateStr: string, format: string) {
    if (!dateStr) return '-';
    return moment(dateStr).format(format);
  }

  getInterDesc(gw) {
    const list = gw.interDesc.split('/');
    const index = parseInt(gw.intervention.split(':')[1]) - 1;
    return list[index];
  }

  async fetchAllGeneralWards() {
    try {
      const res: any = await this.http
        .doPost('general-ward/', {
          page: this.page,
          perPage: this.perPage,
          search: this.search,
          advSearch: this.filters.map((filter) => ({
            ...filter,
            field: this.fields.find((v) => v.value == filter.field)?.key,
          })),
        })
        .toPromise();
      this.generalWardStoreService.generalWards = res.data.map((v) => ({
        ...v,
        expand: false,
      }));

      this.initPagination(res);
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchShiftsByParent(parentId: number) {
    this.shifts = [];
    const res: any = await this.http
      .doGet(`general-ward/shifts/${parentId}`)
      .toPromise();
    this.shifts = res;
    return res;
  }

  expandRow(e, gw, index) {
    console.log(encodeURI);
    console.log(e.target.rowIndex);
    gw.expand = !gw.expand;
    if (gw.expand) {
      const table: any = document.querySelector('.__table');
      const row = table.insertRow(
        index +
          2 +
          this.generalWardStoreService.generalWards.filter(
            (v, i) => v.expand && i < index
          ).length
      );
      const innerTable = document.getElementById('innerTable');
      row.id = `row${gw.syskey}`;

      this.fetchShiftsByParent(gw.syskey).then(() => {
        setTimeout(() => {
          row.innerHTML = innerTable.innerHTML;
        }, 0);
      });
    } else {
      const row = document.querySelector(`#row${gw.syskey}`);
      row.parentElement.removeChild(row);
    }
  }

  goToList(e, gw) {
    e.stopPropagation();
    this.generalWardStoreService.currentSysKey = gw.syskey;
    this.fetchShiftsByParent(gw.syskey).then((shifts: any) => {
      gw.shifts = [...shifts];
      this.shifts = [];
      this.generalWardStoreService.isUpdate = true;
      this.generalWardStoreService.tabNo = 2;
    });
  }

  handlePerPageChanged(perPage) {
    this.page = 1;
    this.perPage = perPage;
    this.fetchAllGeneralWards();
  }

  handleSkip(n: number) {
    this.calculateSkipType(n);
    this.fetchAllGeneralWards();
  }

  advanceSearch(filters) {
    this.filters = filters;
    this.fetchAllGeneralWards();
  }

  normalSearch() {
    this.fetchAllGeneralWards();
  }

  showAll() {
    this.search = '';
    this.filters = [];
    this.fetchAllGeneralWards();
  }
}

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { GeneralWardStoreService } from '../../general-ward-store.service';
import GeneralWard from '../general-ward.model';

@Component({
  selector: 'app-general-ward-list',
  templateUrl: './general-ward-list.component.html',
  styleUrls: ['./general-ward-list.component.css'],
})
export class GeneralWardListComponent implements OnInit {
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
    'Intervention',
    'Type',
    'Initial Date',
    'Patient',
    'Outcome Met',
    'Day Nurse Approved at',
    'Night Nurse Approved at',
  ];
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  generalWards = [];
  open = false;
  fields = [
    {
      text: 'Intervention',
      value: '1',
      key: 'intervention',
    },
    {
      text: 'Type',
      value: '2',
      key: 'problemName',
    },
    {
      text: 'Initial Date',
      value: '3',
      key: 'initialDate',
    },
    {
      text: 'Patient',
      key: 'patientName',
    },
    {
      text: 'Outcome Met',
      value: '4',
      key: 'fmtOutcomeMet',
    },
    {
      text: 'Day Nurse Approved at',
      value: '5',
      key: 'fmtDayAt',
    },
    {
      text: 'Night Nurse Approved at',
      value: '6',
      key: 'fmtNightAt',
    },
  ].map((v, i) => ({ ...v, value: ++i }));
  search = '';

  constructor(
    public appStoreService: AppStoreService,
    public generalWardStoreService: GeneralWardStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle1.style.background = '#3b5998';
    tabEle2.style.background = '#8C9899';
    this.fetchAllGeneralWards();
    this.generalWardStoreService.isUpdate = false;
  }

  formatDate(dateStr: string, format: string) {
    return moment(dateStr).format(format);
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

  fetchAllGeneralWards() {
    this.http.doGet('general-ward/').subscribe((data: any) => {
      data.sort((a, b) => a.type - b.type);

      this.generalWards = data.map((v) => ({
        ...v,
        intervention: v.headerDesc,
        problemName: this.Type[v.type].problemName,
        patientName: '',
        fmtOutcomeMet: v.outcomeMet ? 'Yes' : 'No',
        fmtDayAt: v.dayNurseAt
          ? moment(v.dayNurseAt).format('DD/MM/yyyy h:mm:ss a')
          : '',
        fmtNightAt: v.nightNurseAt
          ? moment(v.nightNurseAt).format('DD/MM/yyyy h:mm:ss a')
          : '',
        fmtInitialDate: v.initialDate
          ? moment(v.initialDate).format('DD/MM/yyyy')
          : '',
      }));

      this.generalWardStoreService.generalWards = [...this.generalWards];

      this.initPagination(data);
    });
  }

  goToList({ syskey }: { syskey: number }) {
    console.log(syskey);
    this.generalWardStoreService.currentSysKey = syskey;
    this.generalWardStoreService.isUpdate = true;
    this.generalWardStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.generalWardStoreService.generalWards);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.start = (this.page - 1) * this.perPage;
            if (
              this.generalWardStoreService.generalWards.length %
                this.perPage ===
              0
            ) {
              this.end = this.page * this.perPage;
            } else {
              this.end =
                this.start +
                (this.generalWardStoreService.generalWards.length %
                  this.perPage);
            }
          }
          this.start = (this.page - 1) * this.perPage;
        }
        break;
      case 2:
        if (this.page > 1) {
          this.page--;
          console.log(this.page);
          this.start = (this.page - 1) * this.perPage;
          this.end = this.page * this.perPage;
        } else {
          this.start = (this.page - 1) * this.perPage;
          this.end = this.perPage;
          if (this.generalWardStoreService.generalWards.length < this.perPage) {
            this.end = this.generalWardStoreService.generalWards.length;
          }
        }
        break;
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (this.generalWardStoreService.generalWards.length < this.perPage) {
          this.end = this.generalWardStoreService.generalWards.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (
          this.generalWardStoreService.generalWards.length % this.perPage ===
          0
        ) {
          this.end = this.page * this.perPage;
        } else {
          this.end =
            this.start +
            (this.generalWardStoreService.generalWards.length % this.perPage);
        }
    }
  }

  openAdvSearch() {
    this.open = true;
  }

  closeFilter() {
    this.open = false;
  }

  advanceSearch(filters) {
    this.generalWardStoreService.generalWards = this.generalWards.filter(
      (instruction) => {
        let flag = true;
        for (const filter of filters) {
          const key = this.fields.find((field) => field.value == filter.field)
            ?.key;
          switch (filter.condition) {
            case '1':
              flag = flag && filter.search == instruction[key];
              break;
            case '2':
              flag =
                flag && instruction[key].toString().includes(filter.search);
              break;
            case '3':
              flag =
                flag && instruction[key].toString().startsWith(filter.search);
              break;
            default:
              flag =
                flag && instruction[key].toString().endsWith(filter.search);
          }
        }
        return flag;
      }
    );
    this.initPagination(this.generalWardStoreService.generalWards);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.generalWardStoreService.generalWards = this.generalWards.filter(
        (instruction) => {
          let flag = false;
          for (const key in instruction) {
            if (searchKeys.includes(key)) {
              flag = flag || instruction[key].toString().includes(this.search);
            }
          }
          return flag;
        }
      );
    }

    this.initPagination(this.generalWardStoreService.generalWards);
  }

  showAll() {
    this.fetchAllGeneralWards();
  }

  clearSearch() {
    this.search = '';
  }
}

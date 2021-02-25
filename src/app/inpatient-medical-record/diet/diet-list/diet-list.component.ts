import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { DietStoreService } from '../diet-store.service';
import * as moment from 'moment';
import Diet from '../diet.model';

@Component({
  selector: 'app-diet-list',
  templateUrl: './diet-list.component.html',
  styleUrls: ['./diet-list.component.css'],
})
export class DietListComponent implements OnInit {
  headers = [
    'No.',
    'Diet And Enteral Feed',
    'Noted By',
    'Remark',
    'Patient ID',
    'Patient Name',
    'Ad No',
  ];
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  diets = [];
  open = false;
  fields = [
    {
      text: 'No.',
      value: '1',
      key: 'no',
    },
    {
      text: 'Diet And Enteral Feed',
      value: '2',
      key: 'dietEnteralFeed',
    },
    {
      text: 'Noted By',
      value: '3',
      key: 'notedBy',
    },
    {
      text: 'Remark',
      value: '4',
      key: 'remark',
    },
    {
      text: 'Patient ID',
      value: '5',
      key: 'patientId',
    },
    {
      text: 'Patient Name',
      value: '6',
      key: 'patientName',
    },
    {
      text: 'Ad No',
      value: '7',
      key: 'adNo',
    },
  ];
  search = '';

  constructor(
    public appStoreService: AppStoreService,
    public dietStoreService: DietStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle1.style.background = '#3b5998';
    tabEle2.style.background = '#8C9899';
    this.fetchAllDiets();
    this.dietStoreService.isUpdate = false;
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

  fetchAllDiets() {
    this.http.doGet(`inpatient-medical-record/diets`).subscribe((data: any) => {
      this.dietStoreService.diets = data.map(
        (v) =>
          new Diet(
            v.syskey,
            v.no,
            v.dietEnteralFeed,
            v.notedBy,
            v.remark,
            v.date,
            v.time,
            v.patientId,
            v.patientName,
            v.adNo
          )
      );

      this.diets = this.dietStoreService.diets;
      this.initPagination(data);
    });
  }

  goToList({ syskey }: { syskey: number }) {
    this.dietStoreService.currentSysKey = syskey;
    this.dietStoreService.isUpdate = true;
    this.dietStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.dietStoreService.diets);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end = this.dietStoreService.diets.length - this.start;
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
          if (this.dietStoreService.diets.length < this.perPage) {
            this.end = this.dietStoreService.diets.length;
          }
        }
        break;
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (this.dietStoreService.diets.length < this.perPage) {
          this.end = this.dietStoreService.diets.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (this.dietStoreService.diets.length % this.perPage === 0) {
          this.end = this.page * this.perPage;
        } else {
          this.end =
            this.start + (this.dietStoreService.diets.length % this.perPage);
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
    this.dietStoreService.diets = this.diets.filter((instruction) => {
      let flag = true;
      for (const filter of filters) {
        const key = this.fields.find((field) => field.value == filter.field)
          ?.key;
        switch (filter.condition) {
          case '1':
            flag = flag && filter.search == instruction[key];
            break;
          case '2':
            flag = flag && instruction[key].toString().includes(filter.search);
            break;
          case '3':
            flag =
              flag && instruction[key].toString().startsWith(filter.search);
            break;
          default:
            flag = flag && instruction[key].toString().endsWith(filter.search);
        }
      }
      return flag;
    });
    this.initPagination(this.dietStoreService.diets);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.dietStoreService.diets = this.diets.filter((instruction) => {
        let flag = false;
        for (const key in instruction) {
          if (searchKeys.includes(key)) {
            flag = flag || instruction[key].toString().includes(this.search);
          }
        }
        return flag;
      });
    }

    this.initPagination(this.dietStoreService.diets);
  }

  showAll() {
    this.fetchAllDiets();
  }

  clearSearch() {
    this.search = '';
  }
}

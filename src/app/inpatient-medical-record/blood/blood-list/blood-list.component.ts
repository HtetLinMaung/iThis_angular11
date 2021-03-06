import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import * as moment from 'moment';
import { BloodStoreService } from '../blood-store.service';
import { CheckList } from '../../non-parenteral/non-parenteral.model';
import Blood from '../blood.model';

@Component({
  selector: 'app-blood-list',
  templateUrl: './blood-list.component.html',
  styleUrls: ['./blood-list.component.css'],
})
export class BloodListComponent implements OnInit {
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
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  bloods = [];
  open = false;
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
  search = '';

  constructor(
    public appStoreService: AppStoreService,
    public bloodStoreService: BloodStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle1.style.background = '#3b5998';
    tabEle2.style.background = '#8C9899';
    this.fetchAllBloods();
    this.bloodStoreService.isUpdate = false;
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

  fetchAllBloods() {
    this.http
      .doGet('inpatient-medical-record/routes')
      .subscribe((routes: any) => {
        this.http
          .doGet('inpatient-medical-record/doses')
          .subscribe((doses: any) => {
            this.http
              .doGet('inpatient-medical-record/drug-tasks')
              .subscribe((drugTasks: any) => {
                this.bloodStoreService.routes = routes.map((v) => ({
                  value: v.route,
                  text: v.EngDesc,
                  syskey: v.syskey,
                }));
                this.bloodStoreService.doses = doses.map((v) => ({
                  text: v.Dose,
                  value: v.EngDesc,
                  syskey: v.syskey,
                }));
                this.bloodStoreService.drugTasks = drugTasks.map((v) => ({
                  text: v.eng_desc,
                  value: v.task,
                  syskey: v.syskey,
                }));

                this.http
                  .doGet(`inpatient-medical-record/bloods`)
                  .subscribe((data: any) => {
                    this.bloodStoreService.bloods = data.map(
                      (v) =>
                        new Blood(
                          v.syskey,
                          v.routeSyskey,
                          v.medication,
                          v.dose,
                          v.stockId,
                          v.doseTypeSyskey,
                          v.remark,
                          v.checkList
                            .map(
                              (item) =>
                                new CheckList(
                                  item.syskey,
                                  item.done,
                                  item.nurseId,
                                  item.doneAt
                                )
                            )
                            .sort((a, b) => a.syskey - b.syskey),
                          this.bloodStoreService.routes.find(
                            (route) => route.syskey == v.routeSyskey
                          ).text,
                          this.bloodStoreService.doses.find(
                            (dose) => dose.syskey == v.doseTypeSyskey
                          ).text,
                          v.checkList.filter((item) => item.done).length,
                          v.moConfirmDate,
                          v.moConfirmTime,
                          v.nurseConfirmDate,
                          v.nurseConfirmTime,
                          v.givenByType,
                          v.patientId,
                          v.patientName,
                          v.adNo,
                          v.RgsNo
                        )
                    );

                    this.bloods = this.bloodStoreService.bloods;
                    this.initPagination(data);
                  });
              });
          });
      });
  }

  goToList({ syskey }: { syskey: number }) {
    this.bloodStoreService.currentSysKey = syskey;
    this.bloodStoreService.isUpdate = true;
    this.bloodStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.bloodStoreService.bloods);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end = this.bloodStoreService.bloods.length - this.start;
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
          if (this.bloodStoreService.bloods.length < this.perPage) {
            this.end = this.bloodStoreService.bloods.length;
          }
        }
        break;
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (this.bloodStoreService.bloods.length < this.perPage) {
          this.end = this.bloodStoreService.bloods.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (this.bloodStoreService.bloods.length % this.perPage === 0) {
          this.end = this.page * this.perPage;
        } else {
          this.end =
            this.start + (this.bloodStoreService.bloods.length % this.perPage);
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
    this.bloodStoreService.bloods = this.bloods.filter((instruction) => {
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
    this.initPagination(this.bloodStoreService.bloods);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.bloodStoreService.bloods = this.bloods.filter((instruction) => {
        let flag = false;
        for (const key in instruction) {
          if (searchKeys.includes(key)) {
            flag = flag || instruction[key].toString().includes(this.search);
          }
        }
        return flag;
      });
    }

    this.initPagination(this.bloodStoreService.bloods);
  }

  showAll() {
    this.fetchAllBloods();
  }

  clearSearch() {
    this.search = '';
  }
}

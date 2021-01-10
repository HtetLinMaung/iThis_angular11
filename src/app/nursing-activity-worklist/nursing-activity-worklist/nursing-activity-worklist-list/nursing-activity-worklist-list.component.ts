import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { NurseActivityWorkListStoreService } from '../../nurse-activity-work-list-store.service';
import * as moment from 'moment';
import Activity from '../../activity.model';

@Component({
  selector: 'app-nursing-activity-worklist-list',
  templateUrl: './nursing-activity-worklist-list.component.html',
  styleUrls: ['./nursing-activity-worklist-list.component.css'],
})
export class NursingActivityWorklistListComponent implements OnInit {
  headers = [
    'Procedure',
    'Date',
    'Due Date For Change',
    'Due Date For Remove',
    'Size',
    'Site',
    'Marking',
    'External Length',
    'Doctor Name',
  ];
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  instructions = [];
  open = false;
  fields = [
    {
      text: 'Procedure',
      value: '1',
      key: 'procedureName',
    },
    {
      text: 'Date',
      value: '2',
      key: 'fmtDate',
    },
    {
      text: 'Due Date For Change',
      value: '3',
      key: 'fmtDueDateForChange',
    },
    {
      text: 'Due Date For Remove',
      value: '4',
      key: 'fmtDueDateForRemove',
    },
    {
      text: 'Size',
      value: '5',
      key: 'fmtSize',
    },
    {
      text: 'Site',
      value: '6',
      key: 'fmtSite',
    },
    {
      text: 'Marking',
      value: '7',
      key: 'fmtMarking',
    },
    {
      text: 'External Length',
      value: '8',
      key: 'fmtExternalLength',
    },
    {
      text: 'Doctor Name',
      value: '9',
      key: 'doctorName',
    },
  ];
  search = '';
  activities: Activity[] = [];

  constructor(
    private http: HttpService,
    public nurseActivityWorkListStoreService: NurseActivityWorkListStoreService
  ) {}

  ngOnInit(): void {
    this.fetchProcedures();
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

  goToList({ syskey }: { syskey: number }) {
    this.nurseActivityWorkListStoreService.currentSysKey = syskey;
    this.nurseActivityWorkListStoreService.isUpdate = true;
    this.nurseActivityWorkListStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.nurseActivityWorkListStoreService.activities);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end =
              this.nurseActivityWorkListStoreService.activities.length -
              this.start;
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
          if (
            this.nurseActivityWorkListStoreService.activities.length <
            this.perPage
          ) {
            this.end = this.nurseActivityWorkListStoreService.activities.length;
          }
        }
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (
          this.nurseActivityWorkListStoreService.activities.length <
          this.perPage
        ) {
          this.end = this.nurseActivityWorkListStoreService.activities.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (
          this.nurseActivityWorkListStoreService.activities.length %
            this.perPage ===
          0
        ) {
          this.end = this.page * this.perPage;
        } else {
          this.end =
            this.start +
            (this.nurseActivityWorkListStoreService.activities.length %
              this.perPage);
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
    this.nurseActivityWorkListStoreService.activities = this.activities.filter(
      (activity) => {
        let flag = true;
        for (const filter of filters) {
          const key = this.fields.find((field) => field.value == filter.field)
            ?.key;
          switch (filter.condition) {
            case '1':
              flag = flag && filter.search == activity[key];
              break;
            case '2':
              flag = flag && activity[key].toString().includes(filter.search);
              break;
            case '3':
              flag = flag && activity[key].toString().startsWith(filter.search);
              break;
            default:
              flag = flag && activity[key].toString().endsWith(filter.search);
          }
        }
        return flag;
      }
    );
    this.initPagination(this.nurseActivityWorkListStoreService.activities);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.nurseActivityWorkListStoreService.activities = this.activities.filter(
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

    this.initPagination(this.nurseActivityWorkListStoreService.activities);
  }

  showAll() {
    this.fetchAllActivities();
  }

  clearSearch() {
    this.search = '';
  }

  getProcedure(procedure) {
    const item = this.nurseActivityWorkListStoreService.procedures.find(
      (v) => v.value == procedure.toString()
    );
    if (item) {
      return item.text;
    }
    return '';
  }

  fetchProcedures() {
    this.http.doGet('nurse-activity-worklist/procedures').subscribe(
      (data: any) => {
        this.nurseActivityWorkListStoreService.procedures = data;
        this.fetchAllActivities();
      },
      (error) => {},
      () => {}
    );
  }

  fetchAllActivities() {
    this.http.doGet('nurse-activity-worklist/activities').subscribe(
      (data: any) => {
        this.nurseActivityWorkListStoreService.activities = data.map(
          (v) =>
            new Activity(
              v.syskey,
              this.getProcedure(v.procedure),
              v.procedure,
              v.date,
              v.dueDateChange,
              v.dueDateRemove,
              this.formatDate(v.date, 'DD/MM/yyyy'),
              this.formatDate(v.dueDateChange, 'DD/MM/yyyy'),
              this.formatDate(v.dueDateRemove, 'DD/MM/yyyy'),
              v.size,
              v.site,
              v.marking,
              v.externalLength,
              v.doctorName,
              v.doctorId,
              v.sizeUnit,
              v.siteUnit,
              v.markingUnit,
              v.externalLengthUnit,
              v.size + v.sizeUnit,
              v.site + v.siteUnit,
              v.marking + v.markingUnit,
              v.externalLength + v.externalLengthUnit
            )
        );
        this.activities = this.nurseActivityWorkListStoreService.activities;
        this.initPagination(data);
      },
      (error) => {},
      () => {}
    );
  }
}

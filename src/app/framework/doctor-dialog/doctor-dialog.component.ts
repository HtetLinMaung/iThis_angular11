import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from '../http.service';
import { Doctor } from './doctor.model';

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrls: ['./doctor-dialog.component.css'],
})
export class DoctorDialogComponent implements OnInit {
  headers = ['ID', 'Name', 'Speciality', 'Rank', 'Degree', 'Phone', 'Clinic'];
  doctors: Doctor[] = [];
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  fields = [
    {
      text: 'ID',
      value: '1',
      key: 'DrID',
    },
    {
      text: 'Name',
      value: '2',
      key: 'name',
    },
    {
      text: 'Speciality',
      value: '3',
      key: 'spname',
    },
    {
      text: 'Rank',
      value: '4',
      key: 'rank',
    },
    {
      text: 'Degree',
      value: '5',
      key: 'Degree1',
    },
    {
      text: 'Phone',
      value: '6',
      key: 'Phone',
    },
    {
      text: 'Clinic',
      value: '7',
      key: 'clinicname',
    },
  ];
  search = '';
  open = false;
  filters = [];

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  selectDoctor(doctor: Doctor) {
    this.appStoreService.doctor = doctor;
    this.appStoreService.doctorDialog = false;
  }

  initPagination(data) {
    this.start = data.from;
    this.end = data.to;
    this.total = data.total;
    this.totalPage = data.lastPage;
  }

  fetchDoctors() {
    this.http
      .doPost('nurse-activity-worklist/doctors', {
        page: this.page,
        perPage: this.perPage,
        search: this.search,
        advSearch: this.filters.map((filter) => ({
          ...filter,
          field: this.fields.find((v) => v.value == filter.field)?.key,
        })),
      })
      .subscribe(
        (data: any) => {
          this.appStoreService.doctors = [...data.data];
          this.initPagination(data);
        },
        (error) => {},
        () => {}
      );
  }

  handlePerPageChanged(perPage) {
    this.page = 1;
    this.perPage = perPage;
    this.fetchDoctors();
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
        }
        break;
      case 2:
        if (this.page > 1) {
          this.page--;
        }
        break;
      case 3:
        this.page = 1;
        break;
      default:
        this.page = this.totalPage;
    }
    this.fetchDoctors();
  }

  openAdvSearch() {
    this.open = true;
  }

  closeFilter() {
    this.open = false;
  }

  advanceSearch(filters) {
    this.filters = filters;
    this.fetchDoctors();
  }

  normalSearch() {
    this.fetchDoctors();
  }

  showAll() {
    this.search = '';
    this.filters = [];
    this.fetchDoctors();
  }

  clearSearch() {
    this.search = '';
  }

  closeDialog() {
    this.appStoreService.doctorDialog = false;
  }

  preventBubble(e) {
    e.stopPropagation();
  }
}

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import CommonUtil from 'src/app/utils/common.util';
import { HttpService } from '../http.service';
import { Doctor } from './doctor.model';

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrls: ['./doctor-dialog.component.css'],
})
export class DoctorDialogComponent extends CommonUtil implements OnInit {
  headers = ['ID', 'Name', 'Speciality', 'Rank', 'Degree', 'Phone', 'Clinic'];
  doctors: Doctor[] = [];
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

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  selectDoctor(doctor: Doctor) {
    this.appStoreService.doctor = doctor;
    this.appStoreService.doctorDialog = false;
  }

  fetchDoctors() {
    this.http
      .doPost('nurse-activity-worklist/doctors', {
        sortBy: 'syskey',
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
    this.calculateSkipType(n);
    this.fetchDoctors();
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

  closeDialog() {
    this.appStoreService.doctorDialog = false;
  }
}

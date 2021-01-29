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
      key: 'doctorID',
    },
    {
      text: 'Name',
      value: '2',
      key: 'doctorName',
    },
    {
      text: 'Speciality',
      value: '3',
      key: 'speciality',
    },
    {
      text: 'Rank',
      value: '4',
      key: 'rank',
    },
    {
      text: 'Degree',
      value: '5',
      key: 'degree',
    },
    {
      text: 'Phone',
      value: '6',
      key: 'phone',
    },
    {
      text: 'Clinic',
      value: '7',
      key: 'clinic',
    },
  ];
  search = '';
  open = false;

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

  fetchDoctors() {
    this.http.doGet('nurse-activity-worklist/doctors').subscribe(
      (data: Doctor[]) => {
        this.appStoreService.doctors = [...data];
        this.doctors = data;
        this.initPagination(data);
      },
      (error) => {},
      () => {}
    );
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.doctors);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end = this.doctors.length - this.start;
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
          if (this.doctors.length < this.perPage) {
            this.end = this.doctors.length;
          }
        }
        break;
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (this.doctors.length < this.perPage) {
          this.end = this.doctors.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (this.doctors.length % this.perPage === 0) {
          this.end = this.page * this.perPage;
        } else {
          this.end = this.start + (this.doctors.length % this.perPage);
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
    this.doctors = this.appStoreService.doctors.filter((doctor) => {
      let flag = true;
      for (const filter of filters) {
        const key = this.fields.find((field) => field.value == filter.field)
          ?.key;
        switch (filter.condition) {
          case '1':
            flag = flag && filter.search == doctor[key];
            break;
          case '2':
            flag = flag && doctor[key].toString().includes(filter.search);
            break;
          case '3':
            flag = flag && doctor[key].toString().startsWith(filter.search);
            break;
          default:
            flag = flag && doctor[key].toString().endsWith(filter.search);
        }
      }
      return flag;
    });
    this.initPagination(this.doctors);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.doctors = this.appStoreService.doctors.filter((doctor) => {
        let flag = false;
        for (const key in doctor) {
          if (searchKeys.includes(key)) {
            flag = flag || doctor[key].toString().includes(this.search);
          }
        }
        return flag;
      });
    }

    this.initPagination(this.doctors);
  }

  showAll() {
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

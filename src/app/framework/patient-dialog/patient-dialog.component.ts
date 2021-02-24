import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { Patient } from 'src/app/patient.model';

import { HttpService } from '../http.service';
import PatientData from './patient.model';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css'],
})
export class PatientDialogComponent implements OnInit {
  headers = [
    'AD No.',
    'ID',
    'Name',
    'Father Name',
    'Address',
    'MCard No.',
    'Doctor',
    'Speciality',
    'Rm. No.',
    'AD Date',
    'Dpt. Date',
  ];
  patients: PatientData[] = [];
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  fields = [
    {
      text: 'AD No.',
      value: '1',
      key: 'adNo',
    },
    {
      text: 'ID',
      value: '2',
      key: 'id',
    },
    {
      text: 'Name',
      value: '3',
      key: 'name',
    },
    {
      text: 'Father Name',
      value: '4',
      key: 'fatherName',
    },
    {
      text: 'Address',
      value: '5',
      key: 'address',
    },
    {
      text: 'MCard No.',
      value: '6',
      key: 'mCardNo',
    },
    {
      text: 'Doctor',
      value: '7',
      key: 'doctor',
    },
    {
      text: 'Speciality',
      value: '8',
      key: 'speciality',
    },
    {
      text: 'Rm. No.',
      value: '9',
      key: 'roomNo',
    },
    {
      text: 'AD Date',
      value: '10',
      key: 'adDate',
    },
    {
      text: 'Dpt. Date',
      value: '11',
      key: 'dptDate',
    },
  ];
  search = '';
  open = false;
  rgsStatus = 0;
  patientType = 0;
  patientTypes = [];
  patientStatusList = [
    {
      value: 0,
      text: 'Active',
    },
    {
      value: 1,
      text: 'Discharge',
    },
    {
      value: 3,
      text: 'Rm  Transfer',
    },
    {
      value: 4,
      text: 'Ep. Transfer',
    },
    {
      value: 5,
      text: 'Inactive',
    },
  ];

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
    this.fetchInitialData();
  }

  fetchPatientInfoById() {
    if (!this.appStoreService.pId) return;
    this.http
      .doGet(`nurse-activity-worklist/patient-info/${this.appStoreService.pId}`)
      .subscribe(
        (data: any) => {
          this.appStoreService.patientDetail.headerData = data;
          this.appStoreService.onPatientIdChanged();
          if (data.length) {
            this.appStoreService.patientDetail.patientId = data[0].patientid;
            this.appStoreService.patientDetail.patientName =
              data[0].persontitle + ' ' + data[0].personname;
            this.appStoreService.patientDetail.patientAge = data[0].age;
            this.appStoreService.patientDetail.ADDate = data[0].arriveDate;
            this.appStoreService.patientDetail.room = data[0].roomNo;
            this.appStoreService.patientDetail.doctor = data[0].doctorName;
            this.appStoreService.patientDetail.speciality = data[0].speciality;
            this.appStoreService.patientDetail.patientType =
              data[0].patientType;
            this.appStoreService.patientDetail.adNos = data.map((v) => ({
              value: v.refNo,
              text: v.refNo,
            }));
            this.appStoreService.patientDetail.adNo = data[0].refNo;
            this.appStoreService.patientInfo = new Patient(
              data[0].allergy,
              data[0].ward,
              data[0].bed
            );
            this.appStoreService.rgsNo = data[0].rgsNo;
            this.appStoreService.drID = data[0].drID;
          }
        },
        (error) => {},
        () => {}
      );
  }

  selectPatient(patient: PatientData) {
    this.appStoreService.pId = patient.pId;

    this.appStoreService.patientDialog = false;
    this.fetchPatientInfoById();
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

  fetchInitialData() {
    this.http
      .doGet('nurse-activity-worklist/patient-types')
      .subscribe((data: any) => {
        this.patientTypes = data.patientTypeList;
        this.patientType = data.currentPatientType;
        this.fetchPatients();
      });
  }

  fetchPatients() {
    this.http
      .doPost('nurse-activity-worklist/patients', {
        patientType: this.patientType,
        rgsStatus: this.rgsStatus,
      })
      .subscribe(
        (data: PatientData[]) => {
          this.appStoreService.patients = [...data];
          this.patients = data;
          this.initPagination(data);
        },
        (error) => {},
        () => {}
      );
  }

  handleChange() {
    this.fetchPatients();
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.patients);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end = this.patients.length - this.start;
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
          if (this.patients.length < this.perPage) {
            this.end = this.patients.length;
          }
        }
        break;
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (this.patients.length < this.perPage) {
          this.end = this.patients.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (this.patients.length % this.perPage === 0) {
          this.end = this.page * this.perPage;
        } else {
          this.end = this.start + (this.patients.length % this.perPage);
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
    this.patients = this.appStoreService.patients.filter((doctor) => {
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
    this.initPagination(this.patients);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.patients = this.appStoreService.patients.filter((doctor) => {
        let flag = false;
        for (const key in doctor) {
          if (searchKeys.includes(key)) {
            flag = flag || doctor[key].toString().includes(this.search);
          }
        }
        return flag;
      });
    }

    this.initPagination(this.patients);
  }

  showAll() {
    this.fetchPatients();
  }

  clearSearch() {
    this.search = '';
  }

  closeDialog() {
    this.appStoreService.patientDialog = false;
  }

  preventBubble(e) {
    e.stopPropagation();
  }
}

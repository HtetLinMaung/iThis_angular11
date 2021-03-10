import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { Patient } from 'src/app/patient.model';
import CommonUtil from 'src/app/utils/common.util';

import { HttpService } from '../http.service';
import PatientData from './patient.model';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css'],
})
export class PatientDialogComponent extends CommonUtil implements OnInit {
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
  fields = [
    {
      text: 'AD No.',
      value: '1',
      key: 'RefNo',
    },
    {
      text: 'ID',
      value: '2',
      key: 'pId',
    },
    {
      text: 'Name',
      value: '3',
      key: 'RgsName',
    },
    {
      text: 'Father Name',
      value: '4',
      key: 'FatherName',
    },
    {
      text: 'Address',
      value: '5',
      key: 'Address',
    },
    {
      text: 'MCard No.',
      value: '6',
      key: 'MCardNo',
    },
    {
      text: 'Doctor',
      value: '7',
      key: 'docfname',
    },
    {
      text: 'Speciality',
      value: '8',
      key: 'speicality',
    },
    {
      text: 'Rm. No.',
      value: '9',
      key: 'roomNo',
    },
    {
      text: 'AD Date',
      value: '10',
      key: 'ArivDate',
    },
    {
      text: 'Dpt. Date',
      value: '11',
      key: 'DptDate',
    },
  ];
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
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchInitialData();
  }

  selectPatient(patient: PatientData) {
    this.appStoreService.pId = patient.pId;
    this.appStoreService.rgsNo = patient.rgsNo;
    this.appStoreService.patientDialog = false;
    this.setPatientDetail(this.http, this.appStoreService, patient);
  }

  fetchInitialData() {
    this.http.doGet('patients/patient-types').subscribe((data: any) => {
      this.patientTypes = [...data.patientTypeList];
      this.appStoreService.patientTypes = data.patientTypeList;
      this.patientType = data.currentPatientType;
      this.fetchPatients();
    });
  }

  fetchPatients() {
    this.http
      .doPost('patients/', {
        patientType: this.patientType,
        rgsStatus: this.rgsStatus,
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
          this.appStoreService.patients = [...data.data] as PatientData[];
          this.initPagination(data);
        },
        (error) => {},
        () => {}
      );
  }

  handleChange() {
    this.page = 1;
    this.fetchPatients();
  }

  handlePerPageChanged(perPage) {
    this.page = 1;
    this.perPage = perPage;
    this.fetchPatients();
  }

  handleSkip(n: number) {
    this.calculateSkipType(n);
    this.fetchPatients();
  }

  advanceSearch(filters) {
    this.filters = filters;
    this.fetchPatients();
  }

  normalSearch() {
    this.fetchPatients();
  }

  showAll() {
    this.search = '';
    this.filters = [];
    this.fetchPatients();
  }

  closeDialog() {
    this.appStoreService.patientDialog = false;
  }
}

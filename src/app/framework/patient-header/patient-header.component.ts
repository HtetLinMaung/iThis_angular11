import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { Patient } from 'src/app/patient.model';
import CommonUtil from 'src/app/utils/common.util';

import { HttpService } from '../http.service';
import PatientData from '../patient-dialog/patient.model';

@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.css'],
})
export class PatientHeaderComponent extends CommonUtil implements OnInit {
  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService
  ) {
    super();
    this.appStoreService.fetchPatientByRgsNo = (rgsNo: number) => {
      this.http.doGet(`patients/${rgsNo}`).subscribe((patient: PatientData) => {
        this.http
          .doGet(`patients/adnos/${patient.pId}`)
          .subscribe((data: { text: string; value: string }[]) => {
            this.appStoreService.patientDetail.adNos = data;
            this.appStoreService.patientDetail.adNo = patient.rgsNo + '';
          });
        this.appStoreService.pId = patient.pId;
        this.appStoreService.rgsNo = patient.rgsNo;
        this.appStoreService.drID = parseInt(patient.drID || '0');
        this.appStoreService.patientDetail.patientId = patient.id;
        this.appStoreService.patientDetail.patientName = patient.name;
        this.appStoreService.patientDetail.patientAge = patient.age;
        this.appStoreService.patientDetail.ADDate = patient.adDate;
        this.appStoreService.patientDetail.room = patient.roomNo;
        this.appStoreService.patientDetail.doctor = patient.doctor;
        this.appStoreService.patientDetail.speciality = patient.speciality;
        this.appStoreService.patientDetail.patientType = this.appStoreService.patientTypes.find(
          (v) => v.value == patient.patientType
        ).text;
        this.appStoreService.patientInfo = new Patient(
          patient.allergy,
          patient.ward,
          patient.bed
        );
      });
    };
  }

  ngOnInit(): void {}

  onAdNoChanged(event) {
    this.appStoreService.fetchPatientByRgsNo(
      this.appStoreService.patientDetail.adNo
    );
    this.appStoreService.onAdNoChanged(event.target.value);
  }

  viewInfo(e) {
    const dialogEle = document.getElementById('info-dialog');
    dialogEle.style.left = e.clientX + 'px';
    dialogEle.style.top = e.clientY + 'px';
    dialogEle.style.display = 'block';
  }

  closeInfoDialog() {
    const dialogEle = document.getElementById('info-dialog');
    dialogEle.style.display = 'none';
  }

  browsePatients() {
    this.appStoreService.patientDialog = true;
  }

  clear() {
    this.appStoreService.pId = 0;
    this.appStoreService.patientDetail = {
      patientId: '',
      patientName: '',
      adNos: [{ text: '-', value: '-' }],
      adNo: '-',
      headerData: [],
      infoDialog: false,
      patientAge: 0,
      ADDate: '',
      room: '',
      doctor: '',
      speciality: '',
      patientType: '',
    };
    this.appStoreService.rgsNo = 0;
    this.appStoreService.drID = 0;
    this.appStoreService.onClear();
  }
}

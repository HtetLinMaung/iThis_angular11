import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { Patient } from 'src/app/patient.model';

import { HttpService } from '../http.service';

@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.css'],
})
export class PatientHeaderComponent implements OnInit {
  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
    this.fetchPatientInfoById();
  }

  onAdNoChanged(event) {
    const data = this.appStoreService.patientDetail.headerData.find(
      (v) => v.refNo == event.target.value
    );
    this.appStoreService.patientDetail.patientId = data.patientid;
    this.appStoreService.patientDetail.patientName =
      data.persontitle + ' ' + data.personname;
    this.appStoreService.patientDetail.patientAge = data.age;
    this.appStoreService.patientDetail.ADDate = data.arriveDate;
    this.appStoreService.patientDetail.room = data.roomNo;
    this.appStoreService.patientDetail.doctor = data.doctorName;
    this.appStoreService.patientDetail.speciality = data.speciality;
    this.appStoreService.patientDetail.patientType = data.patientType;
    this.appStoreService.patientDetail.appStoreService.patientInfo = new Patient(
      data.allergy,
      data.ward,
      data.bed
    );
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

  fetchPatientInfoById() {
    if (!this.appStoreService.pId) return;
    this.http
      .doGet(`nurse-activity-worklist/patient-info/${this.appStoreService.pId}`)
      .subscribe(
        (data: any) => {
          this.appStoreService.patientDetail.headerData = data;
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

  clear() {
    this.appStoreService.pId = 0;
    this.appStoreService.patientDetail = {
      patientId: '',
      patientName: '',
      adNos: [{ value: 0, text: '-' }],
      adNo: 0,
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
  }
}

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
  patientId = '';
  patientName = 'Htet Lin Maung';
  adNos = [{ value: 0, text: '20-A0010' }];
  adNo = 0;
  headerData = [];
  infoDialog = false;
  patientAge = 0;
  ADDate = '';
  room = '';
  doctor = '';
  speciality = '';
  patientType = '';

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
    this.fetchPatientInfoById();
  }

  onAdNoChanged(event) {
    const data = this.headerData.find((v) => v.refNo == event.target.value);
    this.patientId = data.patientid;
    this.patientName = data.persontitle + ' ' + data.personname;
    this.patientAge = data.age;
    this.ADDate = data.arriveDate;
    this.room = data.roomNo;
    this.doctor = data.doctorName;
    this.speciality = data.speciality;
    this.patientType = data.patientType;
    this.appStoreService.patientInfo = new Patient(
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

  fetchPatientInfoById() {
    this.http
      .doGet(`nurse-activity-worklist/patient-info/${this.appStoreService.pId}`)
      .subscribe(
        (data: any) => {
          this.headerData = data;
          if (data.length) {
            this.patientId = data[0].patientid;
            this.patientName = data[0].persontitle + ' ' + data[0].personname;
            this.patientAge = data[0].age;
            this.ADDate = data[0].arriveDate;
            this.room = data[0].roomNo;
            this.doctor = data[0].doctorName;
            this.speciality = data[0].speciality;
            this.patientType = data[0].patientType;
            this.adNos = data.map((v) => ({
              value: v.refNo,
              text: v.refNo,
            }));
            this.adNo = data[0].refNo;
            this.appStoreService.patientInfo = new Patient(
              data[0].allergy,
              data[0].ward,
              data[0].bed
            );
          }
        },
        (error) => {},
        () => {}
      );
  }
}

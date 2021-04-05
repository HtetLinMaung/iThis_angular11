import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStoreService } from 'src/app/app-store.service';
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
    public appStoreService: AppStoreService,
    public route: ActivatedRoute
  ) {
    super();
    this.appStoreService.fetchPatientByRgsNo = (rgsNo: number) => {
      this.http.doGet(`patients/${rgsNo}`).subscribe((patient: PatientData) => {
        this.setPatientDetail(this.http, this.appStoreService, patient);
      });
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = params?.inputUserID;
      if (userId) {
        this.appStoreService.userId = userId;
      }
    });
  }

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

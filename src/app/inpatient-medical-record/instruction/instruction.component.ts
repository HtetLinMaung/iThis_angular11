import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { InstructionStoreService } from './instruction-store.service';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent implements OnInit {
  currentSysKey = 0;
  patientId = 'HRN-0000002';
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
    public instructionStoreService: InstructionStoreService
  ) {}

  ngOnInit(): void {
    this.fetchPatientInfoById();
  }

  onAdNoChanged(event) {
    // const data = this.headerData.find((v) => v.refNo == event.target.value);
    // this.patientId = data.patientid;
    // this.patientName = data.persontitle + ' ' + data.personname;
    // this.patientAge = data.age;
    // this.ADDate = data.arriveDate;
    // this.room = data.roomNo;
    // this.doctor = data.doctorName;
    // this.speciality = data.speciality;
    // this.patientType = data.patientType;
  }

  viewInfo(e) {
    // const dialogEle = document.getElementById("info-dialog");
    // dialogEle.style.left = e.clientX;
    // dialogEle.style.top = e.clientY;
    // dialogEle.style.display = "block";
  }

  tabClickHandler(n: number) {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    switch (n) {
      case 1:
        // this.initPagination();
        tabEle1.style.background = '#3b5998';
        tabEle2.style.background = '#8C9899';
        break;
      default:
        tabEle2.style.background = '#3b5998';
        tabEle1.style.background = '#8C9899';
    }
    this.instructionStoreService.tabNo = n;
    console.log(n);
  }

  fetchPatientInfoById() {
    this.http
      .doGet(`nurse-activity-worklist/patient-info/${this.patientId}`)
      .subscribe(
        (data) => {
          // this.headerData = data;
          // if (data.length) {
          //   this.patientId = data[0].patientid;
          //   this.patientName = data[0].persontitle + ' ' + data[0].personname;
          //   this.patientAge = data[0].age;
          //   this.ADDate = data[0].arriveDate;
          //   this.room = data[0].roomNo;
          //   this.doctor = data[0].doctorName;
          //   this.speciality = data[0].speciality;
          //   this.patientType = data[0].patientType;
          //   this.adNos = data.map((v) => ({
          //     value: v.refNo,
          //     text: v.refNo,
          //   }));
          //   this.adNo = data[0].refNo;
          // }
        },
        (error) => {},
        () => {}
      );
  }
}

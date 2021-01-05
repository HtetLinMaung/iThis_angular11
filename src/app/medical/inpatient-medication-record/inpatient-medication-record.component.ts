import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inpatient-medication-record',
  templateUrl: './inpatient-medication-record.component.html',
  styleUrls: ['./inpatient-medication-record.component.css'],
})
export class InpatientMedicationRecordComponent implements OnInit {
  patientId = 'R20-000017';
  patientName = 'Htet Lin Maung';
  adNos = [{ value: 0, text: '20-A0010' }];
  adNo = 0;
  tabNo = 2;

  constructor() {}

  ngOnInit(): void {}

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
    this.tabNo = n;
    console.log(n);
  }
}

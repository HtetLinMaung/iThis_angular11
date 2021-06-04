import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { GeneralWardStoreService } from '../general-ward-store.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import _ from 'lodash';
@Component({
  selector: 'app-general-ward',
  templateUrl: './general-ward.component.html',
  styleUrls: ['./general-ward.component.css'],
})
export class GeneralWardComponent implements OnInit {
  from = '';
  to = '';
  Type = {
    0: { problemName: '' },
    50: { problemName: 'Breathing', icon: 'fa-lungs' },
    51: { problemName: 'Circulation', icon: 'fa-heartbeat' },
    52: { problemName: 'Communications', icon: 'fa-brain' },
    53: { problemName: 'Comfort', icon: 'fa-smile' },
    54: { problemName: 'Temperature', icon: 'fa-temperature-high' },
    55: { problemName: 'Nutrition', icon: 'fa-lemon' },
    56: { problemName: 'Elimination', icon: 'fa-stethoscope' },
    57: { problemName: 'Resting & Sleeping', icon: 'fa-bed' },
    58: { problemName: 'Risk for fall/ Injury', icon: 'fa-user-injured' },
    59: { problemName: 'Mobilising', icon: 'fa-wheelchair' },
    60: { problemName: 'Personal Hygiene & Skin Care', icon: 'fa-hands-wash' },
    61: { problemName: 'Wound Care', icon: 'fa-first-aid' },
    62: {
      problemName: 'Additional Care Activities',
      icon: 'fa-hand-holding-medical',
    },
    63: { problemName: 'Discharge Activities', icon: 'fa-notes-medical' },
  };

  constructor(
    public appStoreService: AppStoreService,
    public generalWardStoreService: GeneralWardStoreService,
    private http: HttpService
  ) { }

  ngOnInit(): void { }

  tabClickHandler(n: number) {
    this.generalWardStoreService.tabNo = n;
  }

  deleteData() {
    this.generalWardStoreService.deleteDialog = false;
    if (this.generalWardStoreService.isUpdate) {
      this.http
        .doPost(
          `general-ward/delete/${this.generalWardStoreService.currentSysKey}`,
          { syskey: this.generalWardStoreService.detailSyskey }
        )
        .subscribe((data) => {
          this.generalWardStoreService.isUpdate = false;
          this.generalWardStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.generalWardStoreService.deleteDialog = false;
  }

  closeDialog() {
    this.generalWardStoreService.printDialog = false;
  }

  generateDateList(start: moment.Moment, end = moment()): string[] {
    const date = start;
    const dates: string[] = [];
    while (date.isSameOrBefore(end)) {
      dates.push(date.format('yyyy-MM-DD'));
      date.add(1, 'day');
    }
    return dates;
  }

  async print() {
    if (!this.appStoreService.rgsNo) {
      return alert('Please select patient first!');
    }
    this.generalWardStoreService.printDialog = false;
    this.generalWardStoreService.printData = [];

    const res: any = await this.http
      .doPost('general-ward/patient-adl', {
        rgsno: this.appStoreService.rgsNo,
        from: this.from.replace(/-/g, ''),
        to: this.to.replace(/-/g, ''),
      })
      .toPromise();

    this.generalWardStoreService.printDates = this.generateDateList(
      moment(this.from),
      moment(this.to)
    );

    const datesLength = this.generalWardStoreService.printDates.length;
    if (datesLength < 8) {
      for (const i of _.range(0, 8 - datesLength)) {
        this.generalWardStoreService.printDates.push('');
      }
    }

    let oldGoal = '';
    for (const v of res) {
      let goal = v.goal;
      if (v.goal == oldGoal) {
        goal = 0;
      }

      if (oldGoal && v.goal != oldGoal) {
        const length = res.filter((e) => e.goal == oldGoal).length;
        if (length <= 4) {
          for (const i of _.range(0, length)) {
            this.generalWardStoreService.printData.push({
              interDesc: '',
              goal: 0,
              initDate: '',
              printShifts: _.range(0, 16).map(() => false),
              outcomeMetAt: '',
              outcomeMet: false,
            });
          }
        } else {
          for (const i of _.range(0, 3)) {
            this.generalWardStoreService.printData.push({
              interDesc: '',
              goal: 0,
              initDate: '',
              printShifts: _.range(0, 16).map(() => false),
              outcomeMetAt: '',
              outcomeMet: false,
            });
          }
        }
      }
      const printShifts = [];
      for (const date of this.generalWardStoreService.printDates) {
        const shift = v.shifts.find((e) => e.date == date);
        if (shift) {
          printShifts.push(shift.day);
          printShifts.push(shift.night);
        } else {
          printShifts.push(false);
          printShifts.push(false);
        }
      }
      this.generalWardStoreService.printData.push({
        ...v,
        goal,
        originalGoal: v.goal,
        printShifts,
      });

      oldGoal = v.goal;
    }

    this.from = '';
    this.to = '';

    const img = document.createElement('img');
    img.src = 'assets/images/check.png';

    setTimeout(() => {
      let doc = new jsPDF();
      doc.setFontSize(11);
      doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });

      (doc as any).autoTable({
        html: '#general-ward__report',
        startY: 25,
        theme: 'grid',
        headStyles: {
          fillColor: '#686869',
        },
        styles: {
          minCellHeight: 7,
          fontSize: 10,
          valign: 'middle',
          halign: 'center',
        },
      });

      doc.save(
        `gw_${this.appStoreService.patientDetail.patientName
        }_${new Date().toISOString()}.pdf`
      );

      doc = new jsPDF();
      doc.setFontSize(11);
      doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });

      (doc as any).autoTable({
        html: '#general-ward__report2',
        startY: 25,
        theme: 'grid',
        headStyles: {
          fillColor: '#686869',
        },
        styles: {
          minCellHeight: 7,
          minCellWidth: 0,
          fontSize: 9,
          valign: 'middle',
          halign: 'center',
          cellPadding: 0,
        },
        didDrawCell: (data) => {
          if (data.cell.text[0] == 'T') {
            data.cell.text[0] = '';
            doc.addImage(img, 'PNG', data.cell.x + 2, data.cell.y + 1, 5, 5);
          }
        },
      });

      doc.save(
        `gwd_${this.appStoreService.patientDetail.patientName
        }_${new Date().toISOString()}.pdf`
      );
    }, 1000);
  }

  checkFT(e) {
    if (this.to) {
      if (moment(this.to).isSameOrBefore(this.from)) {
        alert('To must not same or before From!');
        this.from = '';
        this.to = '';
      }
      if (moment(this.to).isAfter(moment(this.from).add(8, 'days'))) {
        alert(`Cannot print more than 8 days!`);
        this.from = '';
        this.to = '';
      }
    }
  }
}

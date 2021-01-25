import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { CheckList } from '../../non-parenteral/non-parenteral.model';
import { BloodStoreService } from '../blood-store.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import Blood from '../blood.model';

@Component({
  selector: 'app-blood-form',
  templateUrl: './blood-form.component.html',
  styleUrls: ['./blood-form.component.css'],
})
export class BloodFormComponent implements OnInit {
  date = '';
  time = '';
  givenByType = 'X1';
  moConfirmDate = '';
  nurseConfirmDate = '';
  moConfirmTime = '';
  nurseConfirmTime = '';
  bloods = [new Blood()];

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService,
    public bloodStoreService: BloodStoreService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    this.new();
    this.fetchData();
  }

  getHeaders() {
    if (this.appStoreService.isDoctorRank) {
      return ['', 'Route', 'Medication', 'Dose', 'Remark', ''];
    } else {
      return ['', 'Route', 'Medication', 'Dose', 'Remark', 'Frequency', ''];
    }
  }

  bindEditData() {
    if (this.bloodStoreService.isUpdate) {
      const blood = this.bloodStoreService.bloods.find(
        (v) => v.syskey == this.bloodStoreService.currentSysKey
      );
      this.time = this.appStoreService.isDoctorRank
        ? blood.moConfirmTime
        : blood.nurseConfirmTime;
      this.date = this.appStoreService.isDoctorRank
        ? blood.moConfirmDate
        : blood.nurseConfirmDate;
      this.givenByType = blood.givenByType;
      this.bloods = [blood];
    }
  }

  fetchData() {
    Promise.all([
      this.fetchRoutes(),
      this.fetchDoses(),
      this.fetchDrugTasks(),
    ]).then(([routes, doses, drugTasks]: [any, any, any]) => {
      this.bloodStoreService.routes = routes.map((v) => ({
        value: v.syskey + '',
        text: v.EngDesc,
        syskey: v.syskey,
      }));
      this.bloodStoreService.doses = doses.map((v) => ({
        value: v.syskey + '',
        text: v.Dose,
        syskey: v.syskey,
      }));
      this.bloodStoreService.drugTasks = drugTasks.map((v) => ({
        text: v.eng_desc,
        value: v.task,
        syskey: v.syskey,
      }));
      this.bindEditData();
    });
  }

  addRow() {
    this.bloods.push(new Blood());
  }

  removeRow(key: string) {
    if (this.bloods.length > 1) {
      this.bloods = this.bloods.filter((blood) => blood.key !== key);
    }
  }

  onDoseChange(e, data: Blood) {
    switch (e.target.value) {
      case '3':
        data.checkList = [new CheckList(), new CheckList()];
        break;
      case '4':
        data.checkList = [new CheckList(), new CheckList(), new CheckList()];
        break;
      case '5':
        data.checkList = [
          new CheckList(),
          new CheckList(),
          new CheckList(),
          new CheckList(),
        ];
        break;
      default:
        data.checkList = [new CheckList()];
    }
  }

  fetchRoutes() {
    return this.http.doGet('inpatient-medical-record/routes').toPromise();
  }

  fetchDoses() {
    return this.http.doGet('inpatient-medical-record/doses').toPromise();
  }

  fetchDrugTasks() {
    return this.http.doGet('inpatient-medical-record/drug-tasks').toPromise();
  }

  toggleCheck(e, data: CheckList) {
    data.done = e.target.checked;
    if (data.done) {
      data.doneAt = new Date().toISOString();
      data.nurseId = 1;
    } else {
      data.nurseId = 0;
      data.doneAt = '';
    }
  }

  new() {
    this.bloodStoreService.isUpdate = false;
    this.date = '';
    this.time = '';
    this.givenByType = 'X1';
    this.bloods = [new Blood()];
  }

  save() {
    if (this.bloodStoreService.isUpdate) {
      const v = this.bloodStoreService.bloods[0];
      this.http
        .doPost(
          `inpatient-medical-record/update-blood/${this.bloodStoreService.currentSysKey}`,
          {
            ...v,
            userid: '',
            username: '',
            givenByType: this.givenByType,
            isDoctor: this.appStoreService.isDoctorRank,
            moConfirmDate: this.appStoreService.isDoctorRank
              ? this.date
              : this.moConfirmDate,
            nurseConfirmDate: !this.appStoreService.isDoctorRank
              ? this.date
              : this.nurseConfirmDate,
            moConfirmTime: this.appStoreService.isDoctorRank
              ? this.time
              : this.moConfirmTime,
            nurseConfirmTime: !this.appStoreService.isDoctorRank
              ? this.time
              : this.nurseConfirmTime,
          }
        )
        .subscribe((data: any) => {});
    } else {
      this.http
        .doPost('inpatient-medical-record/save-blood', {
          bloods: this.bloods.map((v) => ({
            ...v,
            userid: '',
            username: '',
            givenByType: this.givenByType,
            isDoctor: this.appStoreService.isDoctorRank,
            moConfirmDate: this.appStoreService.isDoctorRank ? this.date : '',
            nurseConfirmDate: !this.appStoreService.isDoctorRank
              ? this.date
              : '',
            moConfirmTime: this.appStoreService.isDoctorRank ? this.time : '',
            nurseConfirmTime: !this.appStoreService.isDoctorRank
              ? this.time
              : '',
          })),
        })
        .subscribe((data: any) => {
          this.bloodStoreService.tabNo = 1;
        });
    }
  }

  delete() {
    if (this.bloodStoreService.isUpdate)
      this.bloodStoreService.deleteDialog = true;
  }

  formatDate(dateStr: string, format: string) {
    if (!dateStr) return '';
    return moment(dateStr).format(format);
  }

  print() {
    const doc = new jsPDF();
    doc.setFontSize(11);
    doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });
    doc.text(
      `BLOOD, BLOOD PRODUCTS AND TPN - ${
        this.appStoreService.isDoctorRank ? 'DOCTOR' : 'NURSE'
      }`,
      105,
      23,
      {
        align: 'center',
      }
    );

    const pageY = 27;
    if (this.appStoreService.isDoctorRank) {
      doc.rect(14, pageY, 23, 8);
      doc.text('Page No.', 17, pageY + 5.5);
      doc.rect(37, pageY, 16, 8);

      doc.rect(58, pageY, 23, 8);
      doc.text('Next Page', 60, pageY + 5.5);
      doc.rect(81, pageY, 16, 8);

      doc.rect(14, pageY + 9, 83, 8 * 2.5);
      doc.text('DIAGNOSIS', 17, pageY + 14);
      doc.setFontSize(10);
      // doc.text(this.diagnosis + '', 16, pageY + 20);

      doc.rect(14, pageY + 9 + 8 * 2.5, 83 / 2, 8 * 2);

      doc.rect(16, pageY + 9 + 8 * 2.75, 4, 4);
      doc.text('Tube Feed', 22.5, pageY + 9 + 8 * 3.15);
      doc.rect(16, pageY + 9 + 8 * 3.5, 4, 4);
      doc.text('Liquid Medication', 22.5, pageY + 9 + 8 * 3.9);

      doc.rect(14 + 83 / 2, pageY + 9 + 8 * 2.5, 83 / 4, 6);
      doc.rect(14 + 83 / 2 + 83 / 4, pageY + 9 + 8 * 2.5, 83 / 4, 6);

      doc.rect(14 + 83 / 2, pageY + 9 + 8 * 2.5 + 6, 83 / 4, 8 * 2 - 6);
      doc.text('Date Start', 14 + 83 / 2 + 2.5, pageY + 9 + 8 * 2.5 + 4.5);
      doc.text('Date Off', 14 + 83 / 2 + 24, pageY + 9 + 8 * 2.5 + 4.5);

      // doc.text(
      //   this.formatDate(this.dateStart, 'DD/MM/yyyy'),
      //   14 + 83 / 2 + 1,
      //   pageY + 9 + 8 * 2.5 + 12.5
      // );
      // doc.text(
      //   this.formatDate(this.dateOff, 'DD/MM/yyyy'),
      //   14 + 83 / 2 + 23,
      //   pageY + 9 + 8 * 2.5 + 12.5
      // );

      doc.rect(14 + 110, pageY + 9 + 8 * 2.5 + 10, 4, 4);
      doc.text('Chronic Renal Failure', 14 + 116.5, pageY + 9 + 8 * 2.5 + 13);

      doc.rect(14 + 155, pageY + 9 + 8 * 2.5 + 10, 4, 4);
      doc.text('Pregnant', 14 + 161.5, pageY + 9 + 8 * 2.5 + 13);

      doc.rect(
        14 + 83 / 2 + 83 / 4,
        pageY + 9 + 8 * 2.5 + 6,
        83 / 4,
        8 * 2 - 6
      );

      doc.rect(14 + 84, pageY + 9, (83 * 3.2) / 5, 8 * 2.5 + 6);
      doc.rect(14 + 84, pageY + 9, (83 * 3.2) / 5, ((8 * 2.5 + 6) * 1) / 3.5);

      doc.text('DRUG ALLERGY', 14 + 95.5, pageY + 14);
      // doc.text(this.drugAllergyTo + '', 14 + 85, pageY + 20);
      doc.rect(
        14 + 85 + (83 * 3.2) / 5,
        pageY + 9,
        (83 * 2.6) / 5,
        8 * 2.5 + 6
      );
      doc.text("Patient's Label", 14 + 85 + (83 * 3.2) / 5 + 2.5, pageY + 14);

      (doc as any).autoTable({
        html: '#blood-doctor__report',
        startY: 75,
        theme: 'grid',
        headStyles: {
          fillColor: '#686869',
        },
        styles: {
          minCellWidth: 15,
          fontSize: 8,
          valign: 'middle',
          halign: 'center',
        },
      });
      doc.save('blood-doctor.pdf');
    } else {
      doc.rect(14, pageY, 83, 8 * 2.5);
      doc.text('DRUG ALLERGY:', 17, pageY + 5);
      // doc.text(this.drugAllergyTo, 17, pageY + 10);

      doc.rect(14 + 98, pageY, 83, 8 * 2.5);
      doc.text("Patient's Label", 17 + 98, pageY + 5);

      doc.setFontSize(8);
      doc.text(
        'If a Drug is not administered as directed, enter the appropriate code in the administration box and specify in the nursing notes if necessary.',
        17,
        pageY + 25
      );

      doc.setFontSize(9);
      doc.rect(14, pageY + 27, 98 + 83, 8 * 2);
      doc.text('X1  Drug omitted', 17, pageY + 32);
      doc.text('X2  Patient refused', 17, pageY + 40);

      doc.text('X3  Nill by mouth', 90, pageY + 32);
      doc.text('X4  Awaiting supply', 90, pageY + 40);

      doc.text('X5  Stat dose given', 143, pageY + 32);
      doc.text('X6  Others: specify in nursing notes', 143, pageY + 40);

      (doc as any).autoTable({
        html: '#blood-nurse__report',
        startY: 75,
        theme: 'grid',
        headStyles: {
          fillColor: '#686869',
        },
        styles: {
          minCellHeight: 7,
          fontSize: 10,
          valign: 'middle',
          halign: 'center',
          cellPadding: 0,
        },
      });
      doc.save('blood-nurse.pdf');
    }
  }
}

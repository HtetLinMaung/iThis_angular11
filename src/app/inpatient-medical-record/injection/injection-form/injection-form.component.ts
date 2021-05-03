import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { CheckList } from '../../non-parenteral/non-parenteral.model';
import { InjectionStoreService } from '../injection-store.service';
import Injection from '../Injection.model';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import CommonUtil from 'src/app/utils/common.util';
import _ from 'lodash';

@Component({
  selector: 'app-injection-form',
  templateUrl: './injection-form.component.html',
  styleUrls: ['./injection-form.component.css'],
})
export class InjectionFormComponent
  extends CommonUtil
  implements OnInit, OnDestroy {
  date = '';
  time = '';
  givenByType = 'X1';
  moConfirmDate = '';
  nurseConfirmDate = '';
  moConfirmTime = '';
  nurseConfirmTime = '';

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService,
    public injectionStoreService: InjectionStoreService
  ) {
    super();
  }

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';

    this.appStoreService.onClear = this.new.bind(this);
    let callback;
    if (!this.injectionStoreService.isUpdate) {
      this.fetchInitInjections();
      callback = () => {
        this.fetchInitInjections();
      };
    } else {
      callback = () => {};
      this.injectionStoreService.injections = this.injectionStoreService.injections.filter(
        (v) => v.syskey == this.injectionStoreService.currentSysKey
      );
      const data = this.injectionStoreService.injections[0];

      this.date = this.appStoreService.isDoctorRank
        ? data.moConfirmDate
        : data.nurseConfirmDate;
      this.time = this.appStoreService.isDoctorRank
        ? data.moConfirmTime
        : data.nurseConfirmTime;
      this.givenByType = data.givenByType;
      this.moConfirmDate = data.moConfirmDate;
      this.nurseConfirmDate = data.nurseConfirmDate;
      this.moConfirmTime = data.moConfirmTime;
      this.nurseConfirmTime = data.nurseConfirmTime;
      this.appStoreService.onPatientChanged = callback;
      this.appStoreService.fetchPatientByRgsNo(data.rgsNo);
    }
    this.appStoreService.onPatientChanged = callback;
  }

  ngOnDestroy(): void {
    this.appStoreService.onPatientChanged = this.appStoreService.onClear = () => {};
  }

  getHeaders() {
    if (this.appStoreService.isDoctorRank) {
      return ['Route', 'Medication', 'Dose', 'Remark'];
    } else {
      return ['Route', 'Medication', 'Dose', 'Remark', 'Frequency'];
    }
  }

  async fetchInitInjections() {
    this.appStoreService.isDoctorRank = await this.isDoctorRank(
      this.appStoreService.userId,
      this.http
    );

    this.http
      .doPost('inpatient-medical-record/injections-initial', {
        rgsno: this.appStoreService.rgsNo,
      })
      .subscribe((data: any) => {
        this.injectionStoreService.injections = data.map((v) => ({
          ...v,
          routeSyskey: v.routeSyskey.toString(),
          routeDesc: this.injectionStoreService.routes.find(
            (route) => route.syskey == v.routeSyskey
          ).text,
          doseTypeDesc: this.injectionStoreService.doses.find(
            (dose) => dose.syskey == v.doseTypeSyskey
          ).text,
          checkList: _.range(1, v.frequency + 1).map((n) => new CheckList(n)),
        }));
      });
  }

  toggleCheck(e, data: CheckList) {
    data.done = e.target.checked;
    if (data.done) {
      data.doneAt = new Date().toISOString();
      data.nurseId = parseInt(this.appStoreService.userId || '0');
    } else {
      data.nurseId = 0;
      data.doneAt = '';
    }
  }

  new() {
    this.clear();
    this.injectionStoreService.isUpdate = false;
    this.fetchInitInjections();
  }

  clear() {
    this.date = '';
    this.time = '';
    this.givenByType = 'X1';
    this.moConfirmDate = '';
    this.nurseConfirmDate = '';
    this.moConfirmTime = '';
    this.nurseConfirmTime = '';
    this.injectionStoreService.injections = [];
  }

  save() {
    if (this.appStoreService.loading) return;
    if (this.appStoreService.isDoctorRank == null) {
      return alert('Unauthorized');
    }
    this.appStoreService.loading = true;
    try {
      if (this.injectionStoreService.isUpdate) {
        const v = this.injectionStoreService.injections[0];
        this.http
          .doPost(
            `inpatient-medical-record/update-injection/${this.injectionStoreService.currentSysKey}`,
            {
              ...v,
              userid: this.appStoreService.userId,
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
          .subscribe((data: any) => {
            this.appStoreService.loading = false;
            alert('update successful');
          });
      } else {
        this.http
          .doPost('inpatient-medical-record/save-injection', {
            injections: this.injectionStoreService.injections.map((v) => ({
              ...v,
              pId: this.appStoreService.pId,
              rgsNo: this.appStoreService.rgsNo,
              adNo: this.appStoreService.patientDetail.adNo,
              userid: this.appStoreService.userId,
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
            })),
          })
          .subscribe((data: any) => {
            this.appStoreService.loading = false;
            this.injectionStoreService.tabNo = 1;
            this.clear();
          });
      }
    } catch (err) {
      alert(err.message);
      this.appStoreService.loading = false;
    }
  }

  delete() {
    if (this.injectionStoreService.isUpdate)
      this.injectionStoreService.deleteDialog = true;
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
      `INJECTIONS - ${this.appStoreService.isDoctorRank ? 'DOCTOR' : 'NURSE'}`,
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
        html: '#injection-doctor__report',
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
      doc.save('injection-doctor.pdf');
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
        html: '#injection-nurse__report',
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
      doc.save('injection-nurse.pdf');
    }
  }
}

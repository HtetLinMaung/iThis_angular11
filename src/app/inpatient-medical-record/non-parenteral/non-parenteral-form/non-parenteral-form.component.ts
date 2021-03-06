import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { NonParenteralStoreService } from '../non-parenteral-store.service';
import NonParenteral, { CheckList } from '../non-parenteral.model';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import CommonUtil from 'src/app/utils/common.util';

@Component({
  selector: 'app-non-parenteral-form',
  templateUrl: './non-parenteral-form.component.html',
  styleUrls: ['./non-parenteral-form.component.css'],
})
export class NonParenteralFormComponent
  extends CommonUtil
  implements OnInit, OnDestroy {
  date = '';
  time = '';
  diagnosis = '';
  drugAllergyTo = '';
  chronicRenalFailure = false;
  pregnant = false;
  tubeFeed = false;
  liquidMedication = false;
  dateStart = '';
  dateOff = '';
  givenByType = 'X1';
  moConfirmDate = '';
  nurseConfirmDate = '';
  moConfirmTime = '';
  nurseConfirmTime = '';

  constructor(
    private http: HttpService,
    public nonParenteralStoreService: NonParenteralStoreService,
    public appStoreService: AppStoreService
  ) {
    super();
  }
  ngOnDestroy(): void {
    this.appStoreService.onPatientChanged = this.appStoreService.onClear = () => {};
  }

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    (async () => {
      this.appStoreService.isDoctorRank = await this.isDoctorRank(
        this.appStoreService.userId,
        this.http
      );
    })();
    (this.appStoreService.onPatientChanged = this.fetchNonParenterals.bind(
      this
    ))();
    this.appStoreService.onClear = this.new.bind(this);
    if (this.nonParenteralStoreService.isUpdate) {
      this.nonParenteralStoreService.nonParenterals = this.nonParenteralStoreService.nonParenterals.filter(
        (v) => v.syskey == this.nonParenteralStoreService.currentSysKey
      );
      const data = this.nonParenteralStoreService.nonParenterals[0];
      this.date = this.appStoreService.isDoctorRank
        ? data.moConfirmDate
        : data.nurseConfirmDate;
      this.time = this.appStoreService.isDoctorRank
        ? data.moConfirmTime
        : data.nurseConfirmTime;
      this.diagnosis = data.diagnosis;
      this.drugAllergyTo = data.drugAllergyTo;
      this.chronicRenalFailure = data.chronicRenalFailure;
      this.pregnant = data.pregnant;
      this.tubeFeed = data.tubeFeed;
      this.liquidMedication = data.liquidMedication;
      this.dateStart = data.dateStart;
      this.dateOff = data.dateOff;
      this.givenByType = data.givenByType;
      this.moConfirmDate = data.moConfirmDate;
      this.nurseConfirmDate = data.nurseConfirmDate;
      this.moConfirmTime = data.moConfirmTime;
      this.nurseConfirmTime = data.nurseConfirmTime;
      this.appStoreService.fetchPatientByRgsNo(data.rgsNo);
    }
  }

  getHeaders() {
    if (this.appStoreService.isDoctorRank) {
      return ['Route', 'Medication', 'Dose', 'Remark'];
    } else {
      return ['Route', 'Medication', 'Dose', 'Remark', 'Frequency'];
    }
  }

  async fetchNonParenterals() {
    if (this.nonParenteralStoreService.isUpdate) return;
    // await this.fetchRouteDoseTaskAsync(this.http, this.nonParenteralStoreService);
    this.http
      .doPost('inpatient-medical-record/non-parenterals-initial', {
        rgsno: this.appStoreService.rgsNo,
      })
      .subscribe((data: any) => {
        this.nonParenteralStoreService.nonParenterals = data.map((v) => {
          return new NonParenteral(
            v.syskey,
            v.routeSyskey + '',
            v.medication,
            v.dose,
            v.stockId,
            v.doseTypeSyskey,
            v.remark,
            v.checkList
              .map(
                (item) => new CheckList(0, item.done, item.nurseId, item.doneAt)
              )
              .sort((a, b) => a.syskey - b.syskey),
            this.nonParenteralStoreService.routes.find(
              (route) => route.syskey == v.routeSyskey
            ).text,
            this.nonParenteralStoreService.doses.find(
              (dose) => dose.syskey == v.doseTypeSyskey
            ).text,
            v.checkList.filter((item) => item.done).length
          );
        });

        if (!this.drugAllergyTo) {
          this.fetchAllergiesByPatient(this.appStoreService.pId);
        }
      });
  }

  fetchAllergiesByPatient(pId: number) {
    this.http
      .doGet(`inpatient-medical-record/allergies/${pId}`)
      .subscribe((data: any) => {
        this.drugAllergyTo = data.length ? data[0].allergy : '';
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
    this.nonParenteralStoreService.isUpdate = false;
    this.fetchNonParenterals();
  }

  clear() {
    this.date = '';
    this.time = '';
    this.diagnosis = '';
    this.drugAllergyTo = '';
    this.chronicRenalFailure = false;
    this.pregnant = false;
    this.tubeFeed = false;
    this.liquidMedication = false;
    this.dateStart = '';
    this.dateOff = '';
    this.givenByType = 'X1';
    this.moConfirmDate = '';
    this.nurseConfirmDate = '';
    this.nonParenteralStoreService.nonParenterals = [];
  }

  save() {
    if (this.appStoreService.loading) return;
    if (this.appStoreService.isDoctorRank == null) {
      return alert('Unauthorized');
    }
    this.appStoreService.loading = true;
    try {
      if (this.nonParenteralStoreService.isUpdate) {
        const v = this.nonParenteralStoreService.nonParenterals[0];
        this.http
          .doPost(
            `inpatient-medical-record/update-non-parenteral/${this.nonParenteralStoreService.currentSysKey}`,
            {
              ...v,
              userid: this.appStoreService.userId,
              username: this.appStoreService.username,
              diagnosis: this.diagnosis,
              drugAllergyTo: this.drugAllergyTo,
              dateStart: this.dateStart,
              dateOff: this.dateOff,
              tubeFeed: this.tubeFeed,
              liquidMedication: this.liquidMedication,
              chronicRenalFailure: this.chronicRenalFailure,
              pregnant: this.pregnant,
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
            alert('update successful');
            this.appStoreService.loading = false;
          });
      } else {
        this.http
          .doPost('inpatient-medical-record/save-non-parenteral', {
            nonParenterals: this.nonParenteralStoreService.nonParenterals.map(
              (v) => ({
                ...v,
                pId: this.appStoreService.pId,
                rgsNo: this.appStoreService.rgsNo,
                adNo: this.appStoreService.patientDetail.adNo,
                userid: this.appStoreService.userId,
                username: this.appStoreService.username,
                parentId: v.syskey,
                doctorId: this.appStoreService.drID,
                diagnosis: this.diagnosis,
                drugAllergyTo: this.drugAllergyTo,
                dateStart: this.dateStart,
                dateOff: this.dateOff,
                tubeFeed: this.tubeFeed,
                liquidMedication: this.liquidMedication,
                chronicRenalFailure: this.chronicRenalFailure,
                pregnant: this.pregnant,
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
              })
            ),
          })
          .subscribe((data: any) => {
            this.appStoreService.loading = false;
            this.nonParenteralStoreService.tabNo = 1;
            this.clear();
          });
      }
    } catch (err) {
      alert(err.message);
      this.appStoreService.loading = false;
    }
  }

  delete() {
    if (this.nonParenteralStoreService.isUpdate)
      this.nonParenteralStoreService.deleteDialog = true;
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
      `NON-PARENTERAL - ${
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
      doc.text(this.diagnosis + '', 16, pageY + 20);

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

      doc.text(
        this.formatDate(this.dateStart, 'DD/MM/yyyy'),
        14 + 83 / 2 + 1,
        pageY + 9 + 8 * 2.5 + 12.5
      );
      doc.text(
        this.formatDate(this.dateOff, 'DD/MM/yyyy'),
        14 + 83 / 2 + 23,
        pageY + 9 + 8 * 2.5 + 12.5
      );

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
      doc.text(this.drugAllergyTo + '', 14 + 85, pageY + 20);
      doc.rect(
        14 + 85 + (83 * 3.2) / 5,
        pageY + 9,
        (83 * 2.6) / 5,
        8 * 2.5 + 6
      );
      doc.text("Patient's Label", 14 + 85 + (83 * 3.2) / 5 + 2.5, pageY + 14);

      (doc as any).autoTable({
        html: '#non-parenteral-doctor__report',
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
      doc.save('non-parenteral-doctor.pdf');
    } else {
      doc.rect(14, pageY, 83, 8 * 2.5);
      doc.text('DRUG ALLERGY:', 17, pageY + 5);
      doc.text(this.drugAllergyTo, 17, pageY + 10);

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
        html: '#non-parenteral-nurse__report',
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
      doc.save('non-parenteral-nurse.pdf');
    }
  }
}

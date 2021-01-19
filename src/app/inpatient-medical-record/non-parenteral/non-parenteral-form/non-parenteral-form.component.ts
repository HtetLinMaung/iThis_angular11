import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { NonParenteralStoreService } from '../non-parenteral-store.service';
import NonParenteral, { CheckList } from '../non-parenteral.model';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';

@Component({
  selector: 'app-non-parenteral-form',
  templateUrl: './non-parenteral-form.component.html',
  styleUrls: ['./non-parenteral-form.component.css'],
})
export class NonParenteralFormComponent implements OnInit {
  date = '';
  diagnosis: '';
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

  constructor(
    private http: HttpService,
    public nonParenteralStoreService: NonParenteralStoreService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    this.fetchNonParenterals();
  }

  getHeaders() {
    if (this.appStoreService.isDoctorRank) {
      return ['Route', 'Medication', 'Dose', 'Remark'];
    } else {
      return ['Route', 'Medication', 'Dose', 'Remark', 'Frequency'];
    }
  }

  fetchNonParenterals() {
    Promise.all([
      this.fetchRoutes(),
      this.fetchDrugTasks(),
      this.fetchDoses(),
    ]).then(([routes, drugTasks, doses]: [any, any, any]) => {
      this.nonParenteralStoreService.routes = routes.map((v) => ({
        value: v.syskey + '',
        text: v.EngDesc,
        syskey: v.syskey,
      }));
      this.nonParenteralStoreService.doses = doses.map((v) => ({
        value: v.syskey + '',
        text: v.Dose,
        syskey: v.syskey,
      }));
      this.nonParenteralStoreService.drugTasks = drugTasks.map((v) => ({
        text: v.eng_desc,
        value: v.task,
        syskey: v.syskey,
      }));

      this.http
        .doPost('inpatient-medical-record/non-parenterals-initial', {
          patientId: this.appStoreService.pId,
          rgsno: this.appStoreService.rgsNo,
          doctorId: this.appStoreService.drID,
        })
        .subscribe((data: any) => {
          const nonParenterals = data.map((v, i) => {
            if (i == 0) {
              for (const [key, value] of Object.entries(v)) {
                this[key] = value;
              }
              this.date = this.appStoreService.isDoctorRank
                ? v.moConfirmDate
                : v.nurseConfirmDate;
              this.moConfirmDate = v.moConfirmDate;
              this.nurseConfirmDate = v.nurseConfirmDate;
            }
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
                  (item) =>
                    new CheckList(
                      item.syskey,
                      item.done,
                      item.nurseId,
                      item.doneAt
                    )
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

          if (this.nonParenteralStoreService.isUpdate) {
            this.nonParenteralStoreService.nonParenterals = this.nonParenteralStoreService.nonParenterals.filter(
              (v) => v.syskey == this.nonParenteralStoreService.currentSysKey
            );
          } else {
            if (!this.drugAllergyTo) {
              this.fetchAllergiesByPatient(this.appStoreService.pId);
            }
            this.nonParenteralStoreService.nonParenterals = nonParenterals;
          }
        });
    });
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
      data.nurseId = 1;
    } else {
      data.nurseId = 0;
      data.doneAt = '';
    }
  }

  new() {}

  save() {
    if (this.nonParenteralStoreService.isUpdate) {
      const v = this.nonParenteralStoreService.nonParenterals[0];
      this.http
        .doPost(
          `inpatient-medical-record/update-non-parenteral/${this.nonParenteralStoreService.currentSysKey}`,
          {
            ...v,
            userid: '',
            username: '',
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
          }
        )
        .subscribe((data: any) => {});
    } else {
      this.http
        .doPost('inpatient-medical-record/save-non-parenteral', {
          nonParenterals: this.nonParenteralStoreService.nonParenterals.map(
            (v) => ({
              ...v,
              userid: '',
              username: '',
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
            })
          ),
        })
        .subscribe((data: any) => {});
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
    doc.text('NON-PARENTERAL - DOCTOR', 105, 23, {
      align: 'center',
    });

    const pageY = 27;
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

    doc.rect(14 + 83 / 2 + 83 / 4, pageY + 9 + 8 * 2.5 + 6, 83 / 4, 8 * 2 - 6);

    doc.rect(14 + 84, pageY + 9, (83 * 3.2) / 5, 8 * 2.5 + 6);
    doc.rect(14 + 84, pageY + 9, (83 * 3.2) / 5, ((8 * 2.5 + 6) * 1) / 3.5);

    doc.text('DRUG ALLERGY', 14 + 95.5, pageY + 14);
    doc.text(this.drugAllergyTo + '', 14 + 85, pageY + 20);
    doc.rect(14 + 85 + (83 * 3.2) / 5, pageY + 9, (83 * 2.6) / 5, 8 * 2.5 + 6);
    doc.text("Patient's Label", 14 + 85 + (83 * 3.2) / 5 + 2.5, pageY + 14);

    (doc as any).autoTable({
      html: '#non-parenteral__report',
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
    doc.save('non-parenteral.pdf');
  }
}

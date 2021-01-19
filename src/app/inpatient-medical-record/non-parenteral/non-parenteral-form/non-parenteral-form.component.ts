import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { NonParenteralStoreService } from '../non-parenteral-store.service';
import NonParenteral, { CheckList } from '../non-parenteral.model';

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
                .sort((a, b) => a.syskey - b.syskey)
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

  print() {
    // const doc = new jsPDF();
    // doc.setFontSize(11);
    // doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });
    // doc.text('IN-PATIENT MEDICATION RECORD - INSTRUCTION', 105, 23, {
    //   align: 'center',
    // });
    // this.http
    //   .doGet(`inpatient-medical-record/stat-medications`)
    //   .subscribe((data: any) => {
    //     this.printData = data.map((v) => {
    //       return new StatMedication(
    //         v.syskey,
    //         this.statMedicationStoreService.routes.find(
    //           (item) => item.syskey == v.routeSyskey
    //         ).value,
    //         v.stockDescription,
    //         v.dose,
    //         '',
    //         v.prescriptionRemark,
    //         v.timeAdmin,
    //         v.givenBy,
    //         '',
    //         v.drRemark,
    //         v.stockId,
    //         v.remark,
    //         this.statMedicationStoreService.routes.find(
    //           (item) => item.syskey == v.routeSyskey
    //         ).text,
    //         this.appStoreService.isDoctorRank
    //           ? v.moConfirmDate
    //           : v.nurseConfirmDate
    //       );
    //     });
    //     setTimeout(() => {
    //       (doc as any).autoTable({
    //         html: '#stat-medication__record',
    //         startY: 35,
    //         theme: 'grid',
    //         headStyles: {
    //           fillColor: '#686869',
    //         },
    //         styles: {
    //           fontSize: 9,
    //           valign: 'middle',
    //           halign: 'center',
    //         },
    //       });
    //       doc.save('stat-medication.pdf');
    //     }, 1000);
    //   });
  }
}

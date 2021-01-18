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

  constructor(
    private http: HttpService,
    public nonParenteralStoreService: NonParenteralStoreService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {
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
      this.fetchAllergiesByPatient(this.appStoreService.pId);
      this.http
        .doPost('inpatient-medical-record/non-parenterals-initial', {
          patientId: this.appStoreService.pId,
          rgsno: this.appStoreService.rgsNo,
          doctorId: this.appStoreService.drID,
        })
        .subscribe((data: any) => {
          this.nonParenteralStoreService.nonParenterals = data.map(
            (v) =>
              new NonParenteral(
                v.syskey,
                v.routeSyskey + '',
                v.medication,
                v.dose,
                v.stockId,
                v.doseTypeSyskey,
                '',
                [...Array(v.qty).keys()].map((_) => new CheckList())
              )
          );
          console.log(this.nonParenteralStoreService.nonParenterals);
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
    data.toggleDone(e.target.checked);
  }

  new() {}

  save() {
    if (this.nonParenteralStoreService.isUpdate) {
      // const v = this.statMedicationStoreService.statMedications[0];
      // this.http
      //   .doPost(
      //     `inpatient-medical-record/update-stat-medication/${this.statMedicationStoreService.currentSysKey}`,
      //     {
      //       userid: '',
      //       username: '',
      //       stockId: v.stockId,
      //       stockDescription: v.medication,
      //       timeAdmin: v.timeAdmin,
      //       givenBy: v.givenBy,
      //       drRemark: v.drRemark,
      //       isDoctor: this.appStoreService.isDoctorRank,
      //       moConfirmDate: this.appStoreService.isDoctorRank ? this.date : '',
      //       nurseConfirmDate: !this.appStoreService.isDoctorRank
      //         ? this.date
      //         : '',
      //       routeSyskey: this.statMedicationStoreService.routes.find(
      //         (item) => item.value == v.route
      //       ).syskey,
      //       doseRemarkSyskey: 0,
      //       dose: v.doseCount,
      //       remark: v.remark,
      //       prescriptionRemark: v.prescriptionRemark,
      //     }
      //   )
      //   .subscribe((data: any) => {});
    } else {
      // this.http
      //   .doPost('inpatient-medical-record/save-non-parenteral', {
      //     statMedications: this.nonParenteralStoreService.nonParenterals.map(
      //       (v) => ({
      //         pId: this.appStoreService.pId,
      //         RgsNo: this.appStoreService.rgsNo,
      //         userid: '',
      //         username: '',
      //         parentId: v.syskey,
      //         doctorId: this.appStoreService.drID,
      //         stockId: v.stockId,
      //         stockDescription: v.medication,
      //         frequency: v.frequency,
      //         doseDuration: v.doseDuration,
      //         nurseSign: v.nurseSign,
      //         diagnosis: this.diagnosis,
      //         drugAllergyTo: this.drugAllergyTo,
      //         dateStart: this.dateStart,
      //         dateOff: this.dateOff,
      //         tubeFeed: this.tubeFeed,
      //         liquidMedication: this.liquidMedication,
      //         chronicRenalFailure: this.chronicRenalFailure,
      //         pregnant: this.pregnant,
      //         givenByType: !this.appStoreService.isDoctorRank
      //           ? this.givenByType
      //           : '',
      //         isDoctor: this.appStoreService.isDoctorRank,
      //         moConfirmDate: this.appStoreService.isDoctorRank ? this.date : '',
      //         nurseConfirmDate: !this.appStoreService.isDoctorRank
      //           ? this.date
      //           : '',
      //         routeSyskey: this.nonParenteralStoreService.routes.find(
      //           (item) => item.value == v.route
      //         ).syskey,
      //         dose: v.doseCount,
      //       })
      //     ),
      //   })
      //   .subscribe((data: any) => {});
    }
  }

  delete() {}

  print() {}
}

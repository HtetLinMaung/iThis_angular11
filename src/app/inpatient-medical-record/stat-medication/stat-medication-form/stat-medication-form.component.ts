import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { StatMedicationStoreService } from '../stat-medication-store.service';
import StatMedication from '../stat-medication.model';

@Component({
  selector: 'app-stat-medication-form',
  templateUrl: './stat-medication-form.component.html',
  styleUrls: ['./stat-medication-form.component.css'],
})
export class StatMedicationFormComponent implements OnInit {
  headers = [
    'Route',
    'Medication',
    'Dose',
    'Prescription remarks',
    'Time Admin',
    'Given By',
    "Dr's remark",
  ];
  date = '';

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService,
    public statMedicationStoreService: StatMedicationStoreService
  ) {}

  ngOnInit(): void {
    this.fetchStatMedications();
  }

  fetchStatMedications() {
    Promise.all([
      this.fetchRoutes(),
      this.fetchDoses(),
      this.fetchDrugTasks(),
    ]).then(([routes, doses, drugTasks]: [any, any, any]) => {
      this.statMedicationStoreService.routes = routes.map((v) => ({
        value: v.route,
        text: v.EngDesc,
        syskey: v.syskey,
      }));
      this.statMedicationStoreService.doses = doses.map((v) => ({
        text: v.Dose,
        value: v.EngDesc,
        syskey: v.syskey,
      }));
      this.statMedicationStoreService.drugTasks = drugTasks.map((v) => ({
        text: v.eng_desc,
        value: v.task,
        syskey: v.syskey,
      }));

      this.http
        .doGet('inpatient-medical-record/stat-medications-initial')
        .subscribe((data: any) => {
          for (const v of data) {
            let times = 1;
            switch (data.engdesc) {
              case 'twice a day':
                times = 2;
                break;
              case '3 times a day':
                times = 3;
                break;
              case '4 times a day':
                times = 4;
                break;
            }
            let i = 0;

            while (i++ < times) {
              this.statMedicationStoreService.statMedications.push(
                new StatMedication(
                  v.syskey,
                  v.route,
                  v.medication,
                  v.dose,
                  v.engdesc,
                  '',
                  '',
                  '',
                  '',
                  v.remark,
                  v.stockId
                )
              );
            }
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

  handleRowClick(e) {
    // window.scrollTo({
    //   top: e.clientY,
    //   behavior: 'smooth',
    // });
  }

  new() {}

  save() {
    console.log(this.statMedicationStoreService.statMedications);
    this.http
      .doPost('inpatient-medical-record/save-stat-medication', {
        statMedications: this.statMedicationStoreService.statMedications.map(
          (v) => ({
            pId: this.appStoreService.pId,
            RgsNo: this.appStoreService.rgsNo,
            userid: '',
            username: '',
            parentId: v.syskey,
            doctorId: this.appStoreService.drID,
            stockId: v.stockId,
            stockDescription: v.medication,
            timeAdmin: v.timeAdmin,
            givenBy: v.givenBy,
            drRemark: v.drRemark,
            isDoctor: this.appStoreService.isDoctorRank,
            confirmDate: this.date,
            routeSyskey: this.statMedicationStoreService.routes.find(
              (item) => item.value == v.route
            ).syskey,
            doseTypeSyskey: this.statMedicationStoreService.doses.find(
              (item) => item.value == v.doseDesc
            ).syskey,
            doseRemarkSyskey: 0,
          })
        ),
      })
      .subscribe((data: any) => {});
  }

  delete() {}

  print() {}
}

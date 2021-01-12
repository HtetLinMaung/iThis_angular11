import { Component, OnInit } from '@angular/core';
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
    public statMedicationStoreService: StatMedicationStoreService
  ) {}

  ngOnInit(): void {
    this.fetchStatMedications();
  }

  fetchStatMedications() {
    Promise.all([this.fetchRoutes(), this.fetchDoses()]).then(
      ([routes, doses]: [any, any]) => {
        this.statMedicationStoreService.routes = routes.map((v) => ({
          value: v.route,
          text: v.EngDesc,
        }));
        this.statMedicationStoreService.doses = doses.map((v) => ({
          text: v.Dose,
          value: v.EngDesc,
        }));
        this.http
          .doGet('inpatient-medical-record/stat-medications-initial')
          .subscribe((data: any) => {
            this.statMedicationStoreService.statMedications = data.map(
              (v) =>
                new StatMedication(
                  0,
                  v.route,
                  v.medication,
                  v.dose,
                  v.engdesc,
                  '',
                  '',
                  v.remark
                )
            );
          });
      }
    );
  }

  fetchRoutes() {
    return this.http.doGet('inpatient-medical-record/routes').toPromise();
  }

  fetchDoses() {
    return this.http.doGet('inpatient-medical-record/doses').toPromise();
  }

  handleRowClick(e) {
    window.scrollTo({
      top: e.clientY,
      behavior: 'smooth',
    });
  }

  new() {}

  save() {}

  delete() {}

  print() {}
}

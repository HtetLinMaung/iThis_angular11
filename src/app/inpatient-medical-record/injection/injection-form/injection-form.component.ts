import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { InjectionStoreService } from '../injection-store.service';
import Injection from '../Injection.model';

@Component({
  selector: 'app-injection-form',
  templateUrl: './injection-form.component.html',
  styleUrls: ['./injection-form.component.css'],
})
export class InjectionFormComponent implements OnInit {
  date = '';

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService,
    public injectionStoreService: InjectionStoreService
  ) {}

  ngOnInit(): void {
    this.fetchInjections();
  }

  getHeaders() {
    if (this.appStoreService.isDoctorRank) {
      return ['Route', 'Medication', 'Dose', 'Frequency', 'Duration'];
    } else {
      return [
        'Route',
        'Medication',
        'Dose',
        'Frequency',
        'Duration',
        "Nurse's Sign",
      ];
    }
  }

  fetchInjections() {
    Promise.all([this.fetchRoutes(), this.fetchDoses()]).then(
      ([routes, doses]: [any, any]) => {
        this.injectionStoreService.routes = routes.map((v) => ({
          value: v.route,
          text: v.EngDesc,
        }));
        this.injectionStoreService.doses = doses.map((v) => ({
          text: v.Dose,
          value: v.EngDesc,
        }));
        this.http
          .doGet('inpatient-medical-record/injections-initial')
          .subscribe((data: any) => {
            this.injectionStoreService.injections = data.map(
              (v) =>
                new Injection(
                  0,
                  v.route,
                  v.medication,
                  v.dose,
                  v.engdesc,
                  v.frequency,
                  v.doseDuration
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

  new() {}

  save() {}

  delete() {}

  print() {}
}

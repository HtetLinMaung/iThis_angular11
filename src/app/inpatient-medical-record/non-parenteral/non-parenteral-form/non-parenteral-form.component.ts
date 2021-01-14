import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { NonParenteralStoreService } from '../non-parenteral-store.service';
import NonParenteral from '../non-parenteral.model';

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

  fetchNonParenterals() {
    Promise.all([this.fetchRoutes(), this.fetchDoses()]).then(
      ([routes, doses]: [any, any]) => {
        this.nonParenteralStoreService.routes = routes.map((v) => ({
          value: v.route,
          text: v.EngDesc,
        }));
        this.nonParenteralStoreService.doses = doses.map((v) => ({
          text: v.Dose,
          value: v.EngDesc,
        }));
        this.http
          .doGet('inpatient-medical-record/non-parenterals-initial')
          .subscribe((data: any) => {
            this.nonParenteralStoreService.nonParenterals = data.map(
              (v) =>
                new NonParenteral(
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

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { NonParenteralStoreService } from '../non-parenteral-store.service';

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
    public nonParenteralStoreService: NonParenteralStoreService,
    public appStoreService: AppStoreService
  ) {}

  ngOnInit(): void {}

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

  new() {}

  save() {}

  delete() {}

  print() {}
}

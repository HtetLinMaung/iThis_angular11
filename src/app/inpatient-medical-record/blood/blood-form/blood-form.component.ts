import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { BloodStoreService } from '../blood-store.service';

@Component({
  selector: 'app-blood-form',
  templateUrl: './blood-form.component.html',
  styleUrls: ['./blood-form.component.css'],
})
export class BloodFormComponent implements OnInit {
  date = '';

  constructor(
    public appStoreService: AppStoreService,
    public bloodStoreService: BloodStoreService
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

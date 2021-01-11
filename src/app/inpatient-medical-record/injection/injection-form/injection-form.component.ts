import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { InjectionStoreService } from '../injection-store.service';

@Component({
  selector: 'app-injection-form',
  templateUrl: './injection-form.component.html',
  styleUrls: ['./injection-form.component.css'],
})
export class InjectionFormComponent implements OnInit {
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
    public appStoreService: AppStoreService,
    public injectionStoreService: InjectionStoreService
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

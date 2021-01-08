import { Component, OnInit } from '@angular/core';
import { StatMedicationStoreService } from '../stat-medication-store.service';

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

  constructor(public statMedicationStoreService: StatMedicationStoreService) {}

  ngOnInit(): void {}

  new() {}

  save() {}

  delete() {}

  print() {}
}

import { Component, OnInit } from '@angular/core';
import { NonParenteralStoreService } from '../non-parenteral-store.service';

@Component({
  selector: 'app-non-parenteral-form',
  templateUrl: './non-parenteral-form.component.html',
  styleUrls: ['./non-parenteral-form.component.css'],
})
export class NonParenteralFormComponent implements OnInit {
  headers = ['Route', 'Medication', 'Dose', 'Frequency', 'Duration'];
  date = '';
  diagnosis: '';
  drugAllergyTo = '';
  chronicRenalFailure = false;
  pregnant = false;
  tubeFeed = false;
  liquidMedication = false;
  dateStart = '';
  dateOff = '';

  constructor(public nonParenteralStoreService: NonParenteralStoreService) {}

  ngOnInit(): void {}

  new() {}

  save() {}

  delete() {}

  print() {}
}

import { Component, OnInit } from '@angular/core';
import { DietStoreService } from '../diet-store.service';

@Component({
  selector: 'app-diet-form',
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css'],
})
export class DietFormComponent implements OnInit {
  headers = ['No.', 'Diet And Enteral Feed', 'Noted By', 'D/R/T', 'Remark'];
  date = '';

  constructor(public dietStoreService: DietStoreService) {}

  ngOnInit(): void {}

  new() {}

  save() {}

  delete() {}

  print() {}
}

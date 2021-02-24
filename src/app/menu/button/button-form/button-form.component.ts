import { Component, OnInit } from '@angular/core';
import { ButtonStoreService } from '../button-store.service';

@Component({
  selector: 'app-button-form',
  templateUrl: './button-form.component.html',
  styleUrls: ['./button-form.component.css'],
})
export class ButtonFormComponent implements OnInit {
  code = '';
  description = '';

  constructor(public buttonStoreService: ButtonStoreService) {}

  ngOnInit(): void {}

  new() {}

  save() {}

  delete() {}
}

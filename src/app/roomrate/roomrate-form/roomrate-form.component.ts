import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';

import { RoomrateService } from '../roomrate.service';

@Component({
  selector: 'app-roomrate-form',
  templateUrl: './roomrate-form.component.html',
  styleUrls: ['./roomrate-form.component.css']
})
export class RoomrateFormComponent implements OnInit {
  constructor(
    private http: HttpService,
    public instructionStoreService: RoomrateService,
    public appStoreService: AppStoreService,
  ) { }

  ngOnInit(): void {
  }


}

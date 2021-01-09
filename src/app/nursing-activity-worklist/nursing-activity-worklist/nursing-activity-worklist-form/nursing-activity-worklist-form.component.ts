import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { Doctor } from 'src/app/framework/doctor-dialog/doctor.model';
import { HttpService } from 'src/app/framework/http.service';
import { NurseActivityWorkListStoreService } from '../../nurse-activity-work-list-store.service';

@Component({
  selector: 'app-nursing-activity-worklist-form',
  templateUrl: './nursing-activity-worklist-form.component.html',
  styleUrls: ['./nursing-activity-worklist-form.component.css'],
})
export class NursingActivityWorklistFormComponent implements OnInit {
  procedures = [];
  procedure = '1';
  date = '';
  dueDateChange = '';
  dueDateRemove = '';
  size = '';
  sizeUnit = 'mm';
  site = '';
  siteUnit = 'mm';
  marking = '';
  markingUnit = 'mm';
  externalLength = '';
  externalLengthUnit = 'mm';

  constructor(
    public appStoreService: AppStoreService,
    public nurseActivityWorkListStoreService: NurseActivityWorkListStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.appStoreService.doctor = new Doctor();
  }

  new() {}

  save() {}

  delete() {}

  print() {}

  browseDoctor() {
    this.appStoreService.doctorDialog = true;
  }
}

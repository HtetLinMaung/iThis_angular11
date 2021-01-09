import { Component, OnInit } from '@angular/core';
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
  doctors = [];
  doctorName = '';
  doctorDialog = false;

  constructor(
    public nurseActivityWorkListStoreService: NurseActivityWorkListStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {}

  new() {}

  save() {}

  delete() {}

  print() {}

  browseDoctor() {}
}

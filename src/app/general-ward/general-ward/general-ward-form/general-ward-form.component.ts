import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { GeneralWardStoreService } from '../../general-ward-store.service';

@Component({
  selector: 'app-general-ward-form',
  templateUrl: './general-ward-form.component.html',
  styleUrls: ['./general-ward-form.component.css'],
})
export class GeneralWardFormComponent implements OnInit {
  Type = {
    50: { problemName: 'Breathing', icon: 'fa-lungs' },
    51: { problemName: 'Circulation', icon: 'fa-heartbeat' },
    52: { problemName: 'Communications', icon: 'fa-brain' },
    53: { problemName: 'Comfort', icon: 'fa-smile' },
    54: { problemName: 'Temperature', icon: 'fa-temperature-high' },
    55: { problemName: 'Nutrition', icon: 'fa-lemon' },
    56: { problemName: 'Elimination', icon: 'fa-stethoscope' },
    57: { problemName: 'Resting & Sleeping', icon: 'fa-bed' },
    58: { problemName: 'Risk for fall/ Injury', icon: 'fa-user-injured' },
    59: { problemName: 'Mobilising', icon: 'fa-wheelchair' },
    60: { problemName: 'Personal Hygiene & Skin Care', icon: 'fa-hands-wash' },
    61: { problemName: 'Wound Care', icon: 'fa-first-aid' },
    62: {
      problemName: 'Additional Care Activities',
      icon: 'fa-hand-holding-medical',
    },
    63: { problemName: 'Discharge Activities', icon: 'fa-notes-medical' },
  };

  formData = [];

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService,
    public generalWardStoreService: GeneralWardStoreService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    this.fetchFormData();
  }

  fetchFormData() {
    this.http.doGet('general-ward/initials').subscribe((data: any[]) => {
      this.formData = [...new Set(data.map((v) => v.type))].map(
        (type: number) => ({
          ...this.Type[type],
          items: data
            .filter((v) => v.type == type)
            .map((v) => ({
              interventions: v.headerDesc.split('/'),
              selectedInterventions: '0',
              initialDate: '',
              dayNurse: false,
              nightNurse: false,
              dayNurseAt: '',
              nightNurseAt: '',
              outcomeMet: 'y',
              readonly: true,
            })),
        })
      );
    });
  }

  addRow(items) {
    items.push({
      interventions: [''],
      selectedInterventions: '0',
      initialDate: '',
      dayNurse: false,
      nightNurse: false,
      dayNurseAt: '',
      nightNurseAt: '',
      outcomeMet: 'y',
      readonly: false,
    });
  }

  new() {}

  save() {}

  delete() {}

  print() {}
}

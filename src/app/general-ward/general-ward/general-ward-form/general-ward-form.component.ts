import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { GeneralWardStoreService } from '../../general-ward-store.service';

@Component({
  selector: 'app-general-ward-form',
  templateUrl: './general-ward-form.component.html',
  styleUrls: ['./general-ward-form.component.css'],
})
export class GeneralWardFormComponent implements OnInit {
  formData = [
    {
      icon: 'fa-lungs',
      problemName: 'Breathing',
      items: [
        'O2 Therapy- Nasal/ Facemask/ Trachy Mask/ Ventilator ',
        'Perform O2 Administrtion Care',
        'Monitor O2 Saturation Level',
        'Oral/ Laryngeal Suctioning',
      ].map((v) => ({
        interventions: v.split('/'),
        selectedInterventions: '0',
        initialDate: '',
        dayNurse: false,
        nightNurse: false,
        dayNurseAt: '',
        nightNurseAt: '',
        outcomeMet: 'y',
        readonly: true,
      })),
    },
    {
      icon: 'fa-heartbeat',
      problemName: 'Circulation',
      items: [
        'Circulation',
        'Monitor Blood Pressure',
        'Perform Neurovascular Assessment',
        'Assess for Bleeding',
        'Assess for Redness/ Swelling of Limbs',
        'Observe Diabeties Right foot (last digit)',
      ].map((v) => ({
        interventions: v.split('/'),
        selectedInterventions: '0',
        initialDate: '',
        dayNurse: false,
        nightNurse: false,
        dayNurseAt: '',
        nightNurseAt: '',
        outcomeMet: 'y',
        readonly: true,
      })),
    },
    {
      icon: 'fa-brain',
      problemName: 'Communication',
      items: [
        'Communication',
        'Monitor Conscious Level/ Mental Status',
        'Provide Atternative Means of Communication',
        'Update Patient/ Family on Progress',
      ].map((v) => ({
        interventions: v.split('/'),
        selectedInterventions: '0',
        initialDate: '',
        dayNurse: false,
        nightNurse: false,
        dayNurseAt: '',
        nightNurseAt: '',
        outcomeMet: 'y',
        readonly: true,
      })),
    },
    {
      icon: 'fa-smile',
      problemName: 'Comfort',
      items: [
        'Comfort',
        'Pharmacological Pain Relief Provided',
        'Non-Pharmacological Pain Relief Provided',
      ].map((v) => ({
        interventions: v.split('/'),
        selectedInterventions: '0',
        initialDate: '',
        dayNurse: false,
        nightNurse: false,
        dayNurseAt: '',
        nightNurseAt: '',
        outcomeMet: 'y',
        readonly: true,
      })),
    },
  ];

  constructor(
    public appStoreService: AppStoreService,
    public generalWardStoreService: GeneralWardStoreService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
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

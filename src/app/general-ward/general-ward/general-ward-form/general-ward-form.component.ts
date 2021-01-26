import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-ward-form',
  templateUrl: './general-ward-form.component.html',
  styleUrls: ['./general-ward-form.component.css'],
})
export class GeneralWardFormComponent implements OnInit {
  constructor() {}

  formData = [
    {
      problemName: 'Breathing',
      items: [
        'O2 Therapy- Nasal/ Facemask/ Trachy Mask/ Ventilator ',
        'Perform O2 Administrtion Care',
        'Monitor O2 Saturation Level',
        'Oral/ Laryngeal Suctioning',
      ].map((v) => ({
        interventions: v.split('/'),
        initialDate: '',
        dayNurse: false,
        nightNurse: false,
        dayNurseAt: '',
        nightNurseAt: '',
        outcomeMet: 'y',
      })),
    },
  ];

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
  }
}

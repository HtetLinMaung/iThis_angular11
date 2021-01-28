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

  dayHandler(e, obj) {
    if (e.target.checked) {
      obj.dayNurseAt = new Date().toISOString();
    } else {
      obj.dayNurseAt = '';
    }
  }

  nightHandler(e, obj) {
    if (e.target.checked) {
      obj.nightNurseAt = new Date().toISOString();
    } else {
      obj.nightNurseAt = '';
    }
  }

  fetchFormData() {
    this.http
      .doPost('general-ward/initials', { patientId: this.appStoreService.pId })
      .subscribe((data: any[]) => {
        const parentIdList = [...new Set(data.map((v) => v.parentId))];

        if (data.length) {
          if (!data[0].generalWardLength) {
            this.formData = [...new Set(data.map((v) => v.type))].map(
              (type: number) => ({
                ...this.Type[type],
                type,
                items: data
                  .filter((v) => v.type == type)
                  .map((v) => ({
                    typeId: v.parentId,
                    interventions: v.headerDesc.split('/'),
                    selectedInterventions: '0',
                    interventionData: v.headerDesc.split('/').map((_) => ({
                      initialDate: '',
                      dayNurse: false,
                      nightNurse: false,
                      dayNurseAt: '',
                      nightNurseAt: '',
                      outcomeMet: 'n',
                    })),
                    readonly: true,
                  })),
              })
            );
          } else {
            const newData = [];
            for (const parentId of parentIdList) {
              let element = { interventionData: [] };
              for (const item of data.filter((v) => v.parentId == parentId)) {
                element = {
                  ...item,
                  interventionData: [
                    ...element.interventionData,
                    {
                      syskey: item.syskey,
                      initialDate: item.initialDate,
                      dayNurse: false,
                      nightNurse: false,
                      dayNurseAt: '',
                      nightNurseAt: '',
                      outcomeMet: item.outcomeMet ? 'y' : 'n',
                    },
                  ],
                };
              }
              newData.push(element);
            }

            this.formData = [...new Set(newData.map((v) => v.type))]
              .map((type: number) => ({
                ...this.Type[type],
                type,
                items: newData
                  .filter((v) => v.type == type)
                  .map((v) => ({
                    typeId: v.parentId,
                    interventions: v.headerDesc.split('/'),
                    selectedInterventions: '0',
                    interventionData: v.interventionData,
                    readonly: true,
                  })),
              }))
              .sort((a, b) => a.type - b.type);
          }
        }
      });
  }

  addRow(items) {
    items.push({
      syskey: 0,
      interventions: [''],
      selectedInterventions: '0',
      interventionData: [''].map((_) => ({
        initialDate: '',
        dayNurse: false,
        nightNurse: false,
        dayNurseAt: '',
        nightNurseAt: '',
        outcomeMet: 'n',
      })),
      readonly: false,
    });
  }

  new() {}

  save() {
    const generalWards = [];
    for (const item of this.formData) {
      for (const innerItem of item.items) {
        for (const [index, intervention] of innerItem.interventions.entries()) {
          generalWards.push({
            ...innerItem.interventionData[index],
            syskey: innerItem.interventionData[index].syskey,
            pId: this.appStoreService.pId,
            parentId: innerItem.typeId,
            doctorId: this.appStoreService.drID,
            RgsNo: this.appStoreService.rgsNo,
            userid: '',
            username: '',
            type: item.type,
            outcomeMet:
              innerItem.interventionData[index].outcomeMet == 'y'
                ? true
                : false,
            headerDesc: intervention,
            selectedInterventions: index,
          });
        }
      }
    }

    this.http
      .doPost('general-ward/save', {
        generalWards,
      })
      .subscribe((data) => {
        this.fetchFormData();
      });
  }

  delete() {}

  print() {}
}

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { GeneralWardStoreService } from '../../general-ward-store.service';
import * as moment from 'moment';

@Component({
  selector: 'app-general-ward-form',
  templateUrl: './general-ward-form.component.html',
  styleUrls: ['./general-ward-form.component.css'],
})
export class GeneralWardFormComponent implements OnInit {
  date = new Date().toISOString().slice(0, 10);
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
  updateForm = {
    intervention: '',
    initialDate: '',
    outcomeMet: false,
    outcomeMetAt: '',
    outcomeMetId: '',
    outcomeMetName: '',
    dayNight: false,
    nightNurse: false,
    dayNurseAt: '',
    dayNurseId: '',
    dayNurseName: '',
    nightNurseAt: '',
    nightNurseId: '',
    nightNurseName: '',
    detailSyskey: 0,
  };

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
    if (this.generalWardStoreService.isUpdate) {
      this.updateForm = this.generalWardStoreService.generalWards.find(
        (v) => v.syskey == this.generalWardStoreService.currentSysKey
      ) as any;
    }
    this.fetchFormData();
  }

  formatDate(dateStr: string, format: string) {
    return moment(dateStr).format(format);
  }

  dayHandler(e, obj) {
    if (e.target.checked) {
      obj.dayNurseAt = this.date + new Date().toISOString().slice(10);
      obj.dayNurseId = '1';
      obj.dayNurseName = 'Su Su';
    } else {
      obj.dayNurseAt = '';
      obj.dayNurseId = '';
      obj.dayNurseName = '';
    }
  }

  nightHandler(e, obj) {
    if (e.target.checked) {
      obj.nightNurseAt = this.date + new Date().toISOString().slice(10);
      obj.nightNurseId = '1';
      obj.nightNurseName = 'Mya Mya';
    } else {
      obj.nightNurseAt = '';
      obj.nightNurseId = '';
      obj.nightNurseName = '';
    }
  }

  outcomeHandler(e, obj) {
    if (e.target.checked) {
      obj.outcomeMetAt = this.date + new Date().toISOString().slice(10);
      obj.outcomeMetId = '1';
      obj.outcomeMetName = 'Mya Mya';
    } else {
      obj.outcomeMetAt = '';
      obj.outcomeMetId = '1';
      obj.outcomeMetName = 'Mya Mya';
    }
  }

  handleDateChange(e) {
    this.fetchFormData();
  }

  fetchFormData() {
    this.http
      .doPost('general-ward/initials', {
        patientId: this.appStoreService.pId,
        date: this.date,
      })
      .subscribe((data: any[]) => {
        const parentIdList = [...new Set(data.map((v) => v.parentId))];
        const newData = [...data.filter((v) => !v.parentId)];
        for (const parentId of parentIdList) {
          const filteredList = data.filter(
            (v) => v.parentId == parentId && !v.outcomeMet
          );
          if (!filteredList.length) {
            newData.push({
              ...data.find((v) => v.parentId == parentId),
              typeId: parentId,
              syskey: 0,
              interventions: [''],
              selectedInterventions: '0',
              initialDate: '',
              dayNurse: false,
              nightNurse: false,
              dayNurseAt: '',
              nightNurseAt: '',
              outcomeMet: false,
              dayNurseId: '',
              dayNurseName: '',
              nightNurseId: '',
              nightNurseName: '',
              readonly: false,
            });
          } else {
            newData.push(filteredList[0]);
          }
        }
        newData.sort((a, b) => a.type - b.type);
        this.formData = [...new Set(newData.map((v) => v.type))].map(
          (type: number) => ({
            ...this.Type[type],
            type,
            items: newData
              .filter((v) => v.type == type)
              .map((v) => ({
                syskey: v.syskey || 0,
                typeId: v.parentId,
                interventions: v.headerDesc.split('/'),
                selectedInterventions: v.selectedInterventions || '0',
                initialDate: v.initialDate || '',
                dayNurse: v.dayNurse == null ? false : v.dayNurse,
                nightNurse: v.nightNurse == null ? false : v.nightNurse,
                dayNurseAt: v.dayNurseAt || '',
                dayNurseId: v.dayNurseId || '',
                dayNurseName: v.dayNurseName || '',
                nightNurseId: v.nightNurseId || '',
                nightNurseName: v.nightNurseName || '',
                nightNurseAt: v.nightNurseAt || '',
                outcomeMet: v.outcomeMet || false,
                outcomeMetAt: v.outcomeMetAt || '',
                outcomeMetId: v.outcomeMetId || '',
                outcomeMetName: v.outcomeMetName || '',
                readonly: true,
              })),
          })
        );
      });
  }

  addRow(items) {
    items.push({
      syskey: 0,
      interventions: [''],
      selectedInterventions: '0',
      initialDate: '',
      dayNurse: false,
      nightNurse: false,
      dayNurseAt: '',
      nightNurseAt: '',
      outcomeMet: false,
      dayNurseId: '',
      dayNurseName: '',
      nightNurseId: '',
      nightNurseName: '',
      readonly: false,
    });
  }

  new() {}

  save() {
    if (this.generalWardStoreService.isUpdate) {
      this.http
        .doPost(
          `general-ward/update/${this.generalWardStoreService.currentSysKey}`,
          this.updateForm
        )
        .subscribe((data) => {});
    } else {
      const generalWards = [];
      for (const item of this.formData) {
        for (const innerItem of item.items) {
          generalWards.push({
            ...innerItem,
            pId: this.appStoreService.pId,
            parentId: innerItem.typeId,
            doctorId: this.appStoreService.drID,
            RgsNo: this.appStoreService.rgsNo,
            userid: this.appStoreService.userId,
            username: '',
            type: item.type,
            headerDesc:
              innerItem.interventions[innerItem.selectedInterventions],
          });
        }
      }

      this.http
        .doPost('general-ward/save', {
          generalWards,
          date: this.date,
        })
        .subscribe((data) => {
          this.fetchFormData();
        });
    }
  }

  delete() {
    if (this.generalWardStoreService.isUpdate) {
      this.generalWardStoreService.deleteDialog = true;
      this.generalWardStoreService.detailSyskey = this.updateForm.detailSyskey;
    }
  }

  openPrintDialog() {
    this.generalWardStoreService.printDialog = true;
  }
}

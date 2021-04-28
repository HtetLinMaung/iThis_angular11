import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { GeneralWardStoreService } from '../../general-ward-store.service';
import * as moment from 'moment';
import _ from 'lodash';

const defaultItem = {
  rgsNo: 0,
  id: new Date().toISOString(),
  syskey: 0,
  goal: '50',
  intervention: '-',
  initDate: '',
  outcomeMet: false,
  outcomeMetAt: '',
  detailSyskey: 0,
  readonly: false,
  shifts: [],
  interventionOptions: [{ value: '-', text: '-' }],
};

@Component({
  selector: 'app-general-ward-form',
  templateUrl: './general-ward-form.component.html',
  styleUrls: ['./general-ward-form.component.css'],
})
export class GeneralWardFormComponent implements OnInit, OnDestroy {
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
  initData = [];
  goals = [];
  items = [{ ...defaultItem }];
  dialog = false;
  shifts = [];
  currentId = '';

  oldInitDate = '';

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

    this.appStoreService.onClear = () => {
      this.new();
    };

    this.appStoreService.onPatientChanged = () => {
      if (!this.generalWardStoreService.isUpdate) {
        this.fetchGwsByRgsNo();
      }
    };

    this.fetchInitData();
  }

  ngOnDestroy(): void {
    this.appStoreService.onPatientChanged = this.appStoreService.onClear = () => {};
  }

  async fetchInitData() {
    try {
      const res: any = await this.http.doGet('general-ward/goals').toPromise();
      this.initData = res;
      const types = [...new Set(res.map((item) => item.type))] as number[];

      this.goals = types.map((type) => ({
        value: type,
        text: this.Type[type].problemName,
      }));
      if (this.generalWardStoreService.isUpdate) {
        this.items = this.generalWardStoreService.generalWards.filter(
          (v) => v.syskey == this.generalWardStoreService.currentSysKey
        );
        this.setInterventions(this.items[0].goal, this.items[0]);
        console.log(this.items[0].rgsNo);
        this.oldInitDate = this.items[0].initDate;
        this.appStoreService.fetchPatientByRgsNo(this.items[0].rgsNo);
      } else {
        this.fetchGwsByRgsNo();
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async fetchGwsByRgsNo() {
    this.items = [{ ...defaultItem }];
    const items: any = await this.http
      .doPost('general-ward/with-rgsno', {
        rgsno: this.appStoreService.rgsNo,
      })
      .toPromise();
    if (items.length) {
      this.items = [...items];
      for (const item of this.items) {
        this.setInterventions(item.goal, item);
        item.id = item.syskey.toString();
        item.readonly = true;
        const lastDate = item.shifts[item.shifts.length - 1].date;
        const dates = this.generateDateList(moment(lastDate).add(1, 'day'));
        item.shifts = [
          ...item.shifts,
          ...dates.map((date) => this.getDefaultShift(date)),
        ];
      }
    } else {
      this.setInterventions(this.items[0].goal, this.items[0]);
    }
  }

  generateDateList(start: moment.Moment, end = moment()): string[] {
    const date = start;
    const dates: string[] = [];
    while (date.isSameOrBefore(end)) {
      dates.push(date.format('yyyy-MM-DD'));
      date.add(1, 'day');
    }
    return dates;
  }

  setInterventions(type, item) {
    const filterItems = this.initData.filter((item) => item.type == type);

    item.interventionOptions = [{ value: '-', text: '-' }];

    for (const fItem of filterItems) {
      const intervention = fItem.description.split('/').map((desc, index) => ({
        value: `${fItem.syskey}:${++index}`,
        text: desc,
      }));
      item.interventionOptions.push(...intervention);
    }
  }

  onGoalChanged(e, item) {
    this.setInterventions(e.target.value, item);
    item.intervention = '-';
  }

  onInterventionChanged(e, item) {
    // this.fetchGwByIntervention({ ...item, intervention: e.target.value });
  }

  getDefaultShift(date: string) {
    return {
      syskey: 0,
      day: false,
      night: false,
      date,
      dayAt: '',
      dayId: '',
      dayName: '',
      nightAt: '',
      nightId: '',
      nightName: '',
    };
  }

  onInitDateChanged(e, item) {
    if (moment(e.target.value).isAfter(moment())) {
      alert('Initial Date must not greater than current date');
      item.initDate = this.oldInitDate;
      return;
    }

    if (!item.syskey) {
      item.shifts = [];
      const date = moment(item.initDate);
      while (date.isSameOrBefore(moment())) {
        item.shifts.push(this.getDefaultShift(date.format('yyyy-MM-DD')));
        date.add(1, 'day');
      }
    } else {
      const ok = confirm(
        'Changing this will lost all shift records for this row. Are you sure?'
      );
      if (ok) {
        item.shifts = [];
        const date = moment(e.target.value);
        while (date.isSameOrBefore(moment())) {
          item.shifts.push(this.getDefaultShift(date.format('yyyy-MM-DD')));
          date.add(1, 'day');
        }
      } else {
        item.initDate = this.oldInitDate;
      }
    }
    this.oldInitDate = e.target.value;
  }

  openDialog(item) {
    this.currentId = item.id;
    this.shifts = [...item.shifts];
    this.dialog = true;
  }

  closeDialog(e) {
    this.dialog = false;
    const item = this.items.find((v) => v.id == this.currentId);
    if (item) {
      item.shifts = [...this.shifts];
    }
  }

  stopPropagate(e) {
    e.stopPropagation();
  }

  // async fetchGwByIntervention(item) {
  //   try {
  //     const res: any = await this.http
  //       .doPost('general-ward/with-intervention', item)
  //       .toPromise();
  //     if (!res.syskey) return;
  //     for (const [key, value] of Object.entries(res)) {
  //       item[key] = value;
  //       if (key == 'initDate' && item[key]) {
  //         item.readonly = true;
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // }

  formatDate(dateStr: string, format: string) {
    return moment(dateStr).format(format);
  }

  addRow() {
    this.items.push({ ...defaultItem, id: new Date().toISOString() });
    const item = this.items[this.items.length - 1];
    this.setInterventions(item.goal, item);
  }

  toggleBtn(key: string, item: any) {
    item[key] = !item[key];
    if (key == 'day') {
      if (item['day']) {
        item.dayAt = new Date().toISOString();
        item.dayId = this.appStoreService.userId;
        item.dayName = 'Daw Khin Cho Win';
      } else {
        item.dayAt = '';
        item.dayId = '';
        item.dayName = '';
      }
    } else if (key == 'night') {
      if (item['night']) {
        item.nightAt = new Date().toISOString();
        item.nightId = this.appStoreService.userId;
        item.nightName = 'Daw Su Mon Myat';
      } else {
        item.nightAt = '';
        item.nightId = '';
        item.nightName = '';
      }
    }
  }

  new() {
    this.items = [defaultItem];
    this.setInterventions(this.items[0].goal, this.items[0]);
  }

  async save() {
    if (this.appStoreService.loading) return;

    if (!this.appStoreService.pId) {
      return alert('Please select patient first');
    }

    for (const item of this.items) {
      if (item.intervention == '-') {
        return alert('Intervention must be selected!');
      }
      if (!item.initDate) {
        return alert('Intial Date must not be empty!');
      }
      if (
        this.items.filter((v) => v.intervention == item.intervention).length > 1
      ) {
        return alert('Cannot duplicate same interventions!');
      }
    }

    this.appStoreService.loading = true;
    try {
      const now = new Date().toISOString();
      await this.http
        .doPost('general-ward/save', {
          generalWards: this.items.map((item) => ({
            ...item,
            userid: this.appStoreService.userId,
            username: '',
            rgsNo: this.appStoreService.rgsNo,
            pId: this.appStoreService.pId,
            shifts: item.shifts.map((shift) => ({
              ...shift,
              // dayAt: shift.day ? now : shift.dayAt,
              // dayId: shift.day ? this.appStoreService.userId : shift.dayId,
              // nightAt: shift.night ? now : shift.nightAt,
              // nightId: shift.night
              //   ? this.appStoreService.userId
              //   : shift.nightId,
            })),
            outcomeMetAt: item.outcomeMet ? now : '',
          })),
        })
        .toPromise();
      this.appStoreService.loading = false;
      alert('saved successful');
      this.new();
      this.generalWardStoreService.tabNo = 1;
    } catch (err) {
      console.error(err.message);
      this.appStoreService.loading = false;
    }
  }

  delete() {
    if (this.generalWardStoreService.isUpdate)
      this.generalWardStoreService.deleteDialog = true;
  }

  openPrintDialog() {
    this.generalWardStoreService.printDialog = true;
  }
}

import { Component, OnInit } from '@angular/core';
import { DietStoreService } from '../diet-store.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import Diet from '../diet.model';

@Component({
  selector: 'app-diet-form',
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css'],
})
export class DietFormComponent implements OnInit {
  headers = ['', 'No.', 'Diet And Enteral Feed', 'Noted By', 'Remark', ''];
  date = '';
  time = '';
  diets = [new Diet()];

  constructor(
    public http: HttpService,
    public appStoreService: AppStoreService,
    public dietStoreService: DietStoreService
  ) {}

  ngOnInit(): void {
    const tabEle1 = document.getElementById('tab1');
    const tabEle2 = document.getElementById('tab2');
    tabEle2.style.background = '#3b5998';
    tabEle1.style.background = '#8C9899';
    this.bindEditData();
  }

  bindEditData() {
    if (this.dietStoreService.isUpdate) {
      const diet = this.dietStoreService.diets.find(
        (v) => v.syskey == this.dietStoreService.currentSysKey
      );
      this.time = diet.time;
      this.date = diet.date;

      this.diets = [diet];
    } else {
      this.new();
    }
  }

  formatDate(dateStr: string, format: string) {
    if (!dateStr) return '';
    return moment(dateStr).format(format);
  }

  addRow() {
    if (this.dietStoreService.isUpdate) return;
    this.diets.push(new Diet(0, (this.diets.length + 1).toString()));
  }

  removeRow(key: string) {
    if (this.dietStoreService.isUpdate) return;
    if (this.diets.length > 1) {
      this.diets = this.diets.filter((diet) => diet.key !== key);
    }
  }

  new() {
    this.dietStoreService.isUpdate = false;
    this.date = '';
    this.time = '';
    this.diets = [new Diet()];
  }

  save() {
    if (this.dietStoreService.isUpdate) {
      const v = this.diets[0];
      this.http
        .doPost(
          `inpatient-medical-record/update-diet/${this.dietStoreService.currentSysKey}`,
          {
            ...v,
            userid: '',
            username: '',
            isDoctor: this.appStoreService.isDoctorRank,
            date: this.date,
            time: this.time,
          }
        )
        .subscribe((data: any) => {});
    } else {
      this.http
        .doPost('inpatient-medical-record/save-diets', {
          diets: this.diets.map((v) => ({
            ...v,
            userid: '',
            username: '',
            isDoctor: this.appStoreService.isDoctorRank,
            date: this.date,
            time: this.time,
          })),
        })
        .subscribe((data: any) => {
          this.dietStoreService.tabNo = 1;
        });
    }
  }

  delete() {
    if (this.dietStoreService.isUpdate)
      this.dietStoreService.deleteDialog = true;
  }

  print() {
    const doc = new jsPDF();
    doc.setFontSize(11);
    doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });
    doc.text(`DIET, FLUID ORDERS AND ENTERAL FEEDS`, 105, 23, {
      align: 'center',
    });

    (doc as any).autoTable({
      html: '#diet__report',
      startY: 35,
      theme: 'grid',
      headStyles: {
        fillColor: '#686869',
      },
      styles: {
        minCellWidth: 15,
        fontSize: 8,
        valign: 'middle',
        halign: 'center',
      },
    });
    doc.save('diet.pdf');
  }
}

import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import { AppStoreService } from 'src/app/app-store.service';
import { Doctor } from 'src/app/framework/doctor-dialog/doctor.model';
import { HttpService } from 'src/app/framework/http.service';

import { NurseActivityWorkListStoreService } from '../../nurse-activity-work-list-store.service';

import 'jspdf-autotable';

@Component({
  selector: 'app-nursing-activity-worklist-form',
  templateUrl: './nursing-activity-worklist-form.component.html',
  styleUrls: ['./nursing-activity-worklist-form.component.css'],
})
export class NursingActivityWorklistFormComponent implements OnInit {
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
  filterdPrintData = [];

  constructor(
    public appStoreService: AppStoreService,
    public nurseActivityWorkListStoreService: NurseActivityWorkListStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.appStoreService.doctor = new Doctor();
    this.appStoreService.onClear = () => {
      this.new();
    };
    this.bindEditData();
  }

  bindEditData() {
    if (this.nurseActivityWorkListStoreService.isUpdate) {
      const tabEle1 = document.getElementById('tab1');
      const tabEle2 = document.getElementById('tab2');
      tabEle2.style.background = '#3b5998';
      tabEle1.style.background = '#8C9899';

      const activity = this.nurseActivityWorkListStoreService.activities.find(
        (v) => v.syskey == this.nurseActivityWorkListStoreService.currentSysKey
      );

      this.procedure = activity.procedure.toString();
      this.date = activity.date;
      this.dueDateChange = activity.dueDateChange;
      this.dueDateRemove = activity.dueDateRemove;
      this.size = activity.size.toString();
      this.sizeUnit = activity.sizeUnit;
      this.site = activity.site.toString();
      this.siteUnit = activity.siteUnit;
      this.marking = activity.marking.toString();
      this.markingUnit = activity.markingUnit;
      this.externalLength = activity.externalLength.toString();
      this.externalLengthUnit = activity.externalLengthUnit;
      this.http
        .doGet(`nurse-activity-worklist/doctors/${activity.doctorId}`)
        .subscribe((data: any) => {
          this.appStoreService.doctor = data;
          this.appStoreService.fetchPatientByRgsNo(activity.rgsNo);
        });
    }
  }

  new() {
    this.nurseActivityWorkListStoreService.isUpdate = false;
    this.procedure = '1';
    this.date = '';
    this.dueDateChange = '';
    this.dueDateRemove = '';
    this.size = '';
    this.sizeUnit = 'mm';
    this.site = '';
    this.siteUnit = 'mm';
    this.marking = '';
    this.markingUnit = 'mm';
    this.externalLength = '';
    this.externalLengthUnit = 'mm';
    this.appStoreService.doctor = new Doctor();
  }

  save() {
    this.http
      .doPost(
        `nurse-activity-worklist/${
          !this.nurseActivityWorkListStoreService.isUpdate
            ? 'save'
            : `update/${this.nurseActivityWorkListStoreService.currentSysKey}`
        }`,
        {
          pId: this.appStoreService.pId,
          rgsNo: this.appStoreService.rgsNo,
          userid: this.appStoreService.userId,
          username: '',
          doctorSysKey: this.appStoreService.doctor.syskey,
          procedure: parseInt(this.procedure),
          date: this.date,
          dueDateChange: this.dueDateChange,
          dueDateRemove: this.dueDateRemove,
          size: parseFloat(this.size || '0'),
          site: parseFloat(this.site || '0'),
          marking: parseFloat(this.marking || '0'),
          externalLength: parseFloat(this.externalLength || '0'),
          siteUnit: this.siteUnit,
          sizeUnit: this.sizeUnit,
          markingUnit: this.markingUnit,
          externalLengthUnit: this.externalLengthUnit,
        }
      )
      .subscribe(
        (data: any) => {
          if (!this.nurseActivityWorkListStoreService.isUpdate) {
            this.nurseActivityWorkListStoreService.currentSysKey = data.syskey;
          }
          this.nurseActivityWorkListStoreService.isUpdate = true;
        },
        (error) => {},
        () => {}
      );
  }

  delete() {
    if (this.nurseActivityWorkListStoreService.isUpdate)
      this.nurseActivityWorkListStoreService.deleteDialog = true;
  }

  print() {
    this.http
      .doGet(
        `nurse-activity-worklist/get-by-patient/${this.appStoreService.pId}`
      )
      .subscribe(
        (printData: any) => {
          const query1 = [5, 11, 16, 21, 25, 29, 33, 37, 41, 45]
            .map((n) => `#export_table tr:nth-child(${n}) td:nth-child(1)`)
            .join(', ');
          const query2 = [6, 12, 17, 22, 26, 30, 34, 38, 42, 46]
            .map((n) => `#export_table tr:nth-child(${n}) td:nth-child(1)`)
            .join(', ');
          const elems = document.querySelectorAll(query2);
          const proEles: any = document.querySelectorAll(query1);
          proEles.forEach((p, i) => {
            const tubeName = p.innerHTML.trim();
            const proRef = this.nurseActivityWorkListStoreService.procedures.find(
              (v) => v.text.match(new RegExp(tubeName))
            );
            if (proRef) {
              this.filterdPrintData = printData.filter(
                (p) => p.procedure == proRef.value
              );
              if (this.filterdPrintData.length) {
                elems[i].innerHTML = moment(
                  this.filterdPrintData[0].dueDateChange
                ).format('DD/MM/yyyy');
              }
            }
          });

          const doc = new jsPDF();

          (doc as any).autoTable({
            html: '#export_table',
            startY: 10,
            theme: 'grid',
            didDrawCell: (data) => {
              switch (data.row.index) {
                case 4:
                case 10:
                case 15:
                case 20:
                case 24:
                case 28:
                case 32:
                case 36:
                case 40:
                case 44:
                  const tubeName = data.row.cells[0].text.join(' ');
                  const proRef = this.nurseActivityWorkListStoreService.procedures.find(
                    (v) => v.text.match(new RegExp(tubeName))
                  );
                  if (proRef) {
                    this.filterdPrintData = printData.filter(
                      (p) => p.procedure == proRef.value
                    );
                  }
                  this.filterdPrintData.forEach((p, i) => {
                    if (i < 7) {
                      data.row.cells[i + 1].text[0] = moment(p.date).format(
                        'DD/MM/yyyy'
                      );
                    }
                  });
                  break;
                case 5:
                case 11:
                case 16:
                case 21:
                case 25:
                case 29:
                case 33:
                case 37:
                case 41:
                case 45:
                  // Due Date
                  this.filterdPrintData.forEach((p, i) => {
                    if (i < 7) {
                      data.row.cells[i + 1].text[0] = moment(
                        p.dueDateChange
                      ).format('DD/MM/yyyy');
                    }
                  });
                  break;
                case 34:
                  this.filterdPrintData.forEach((p, i) => {
                    if (i < 7) {
                      data.row.cells[i + 1].text[0] =
                        p.site + p.siteUnit + ' & ' + p.size + p.sizeUnit;
                    }
                  });
                  break;
                case 17:
                case 22:
                case 26:
                case 30:
                case 38:
                  this.filterdPrintData.forEach((p, i) => {
                    if (i < 7) {
                      data.row.cells[i + 1].text[0] = p.site + p.siteUnit;
                    }
                  });
                  break;
                case 6:
                case 12:
                case 18:
                case 42:
                case 46:
                  this.filterdPrintData.forEach((p, i) => {
                    if (i < 7) {
                      data.row.cells[i + 1].text[0] = p.size + p.sizeUnit;
                    }
                  });
                  break;
                case 47:
                case 8:
                  this.filterdPrintData.forEach((p, i) => {
                    if (i < 7) {
                      data.row.cells[i + 1].text[0] =
                        p.externalLength + p.externalLengthUnit;
                    }
                  });
                  break;
                case 7:
                case 13:
                  this.filterdPrintData.forEach((p, i) => {
                    if (i < 7) {
                      data.row.cells[i + 1].text[0] = p.marking + p.markingUnit;
                    }
                  });
                  break;
              }
            },
            willDrawCell: (data) => {
              switch (data.row.index) {
                case 0:
                  doc.setFillColor('#CDC8C8');
                  doc.setTextColor('#fff');
                  break;
                case 3:
                case 9:
                case 14:
                case 19:
                case 23:
                case 27:
                case 31:
                case 35:
                case 39:
                case 43:
                case 48:
                case 50:
                  data.row.height = 1;
                  doc.setFillColor('#CDC8C8');
              }
            },
            styles: {
              fontSize: 9,
              minCellHeight: 1,
              cellPadding: 1,
              valign: 'middle',
            },
          });

          doc.save('nurse activity.pdf');
        },
        (error) => {},
        () => {}
      );
  }

  browseDoctor() {
    this.appStoreService.doctorDialog = true;
  }
}

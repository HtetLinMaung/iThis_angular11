import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { GeneralWardStoreService } from '../general-ward-store.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';

@Component({
  selector: 'app-general-ward',
  templateUrl: './general-ward.component.html',
  styleUrls: ['./general-ward.component.css'],
})
export class GeneralWardComponent implements OnInit {
  from = '';
  to = '';
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

  constructor(
    public appStoreService: AppStoreService,
    public generalWardStoreService: GeneralWardStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {}

  tabClickHandler(n: number) {
    this.generalWardStoreService.tabNo = n;
  }

  deleteData() {
    this.generalWardStoreService.deleteDialog = false;
    if (this.generalWardStoreService.isUpdate) {
      this.http
        .doPost(
          `general-ward/delete/${this.generalWardStoreService.currentSysKey}`,
          { syskey: this.generalWardStoreService.detailSyskey }
        )
        .subscribe((data) => {
          this.generalWardStoreService.isUpdate = false;
          this.generalWardStoreService.tabNo = 1;
        });
    }
  }

  cancelDelete() {
    this.generalWardStoreService.deleteDialog = false;
  }

  closeDialog() {
    this.generalWardStoreService.printDialog = false;
  }

  print() {
    this.generalWardStoreService.printDialog = false;
    this.http
      .doPost('general-ward/with-date', {
        from: this.from,
        to: this.to,
      })
      .subscribe((data: any) => {
        let types: number[] = [];
        const printDates = [];
        for (
          let date = moment(this.from);
          date.isSameOrBefore(this.to);
          date.add(1, 'days')
        ) {
          this.generalWardStoreService.printDates.push(
            date.format('DD/MM/yyyy')
          );
          printDates.push(date);
        }
        while (this.generalWardStoreService.printDates.length < 8) {
          this.generalWardStoreService.printDates.push('');
          printDates.push('');
        }
        this.generalWardStoreService.printData = data.map((v) => {
          const problemName = !types.includes(v.type)
            ? this.Type[v.type].problemName
            : '';
          types = [...new Set([...types, v.type])];
          const checkList = [];
          for (const date of this.generalWardStoreService.printDates) {
            if (
              v.detailList
                .map((detail) => moment(detail.dayNurseAt).format('DD/MM/yyyy'))
                .includes(date)
            ) {
              checkList.push(true);
            } else {
              checkList.push(false);
            }

            if (
              v.detailList
                .map((detail) =>
                  moment(detail.nightNurseAt).format('DD/MM/yyyy')
                )
                .includes(date)
            ) {
              checkList.push(true);
            } else {
              checkList.push(false);
            }
          }
          return {
            ...v,
            problemName,
            checkList,
          };
        });
        this.generalWardStoreService.printData.sort((a, b) => a.type - b.type);
        console.log(this.generalWardStoreService.printData);

        setTimeout(() => {
          let doc = new jsPDF();
          doc.setFontSize(11);
          doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });

          (doc as any).autoTable({
            html: '#general-ward__report',
            startY: 25,
            theme: 'grid',
            headStyles: {
              fillColor: '#686869',
            },
            styles: {
              minCellHeight: 7,
              fontSize: 10,
              valign: 'middle',
              halign: 'center',
              // cellPadding: 0,
            },
          });
          doc.save('general-ward1.pdf');

          doc = new jsPDF();
          doc.setFontSize(11);
          doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });

          (doc as any).autoTable({
            html: '#general-ward__report2',
            startY: 25,
            theme: 'grid',
            headStyles: {
              fillColor: '#686869',
            },
            styles: {
              minCellHeight: 7,
              minCellWidth: 0,
              fontSize: 9,
              valign: 'middle',
              halign: 'center',
              cellPadding: 0,
            },
          });
          doc.save('general-ward2.pdf');
        }, 1000);
      });
  }

  checkFT(e) {
    if (this.to) {
      if (moment(this.to).isSameOrBefore(this.from)) {
        alert('To must not same or before From!');
        this.from = '';
        this.to = '';
      }
      if (moment(this.to).isAfter(moment(this.from).add(8, 'days'))) {
        alert(`Cannot print more than 8 days!`);
        this.from = '';
        this.to = '';
      }
    }
  }
}

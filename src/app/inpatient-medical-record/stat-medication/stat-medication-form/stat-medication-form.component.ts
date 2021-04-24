import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { HttpService } from 'src/app/framework/http.service';
import { StatMedicationStoreService } from '../stat-medication-store.service';
import StatMedication from '../stat-medication.model';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import CommonUtil from 'src/app/utils/common.util';

@Component({
  selector: 'app-stat-medication-form',
  templateUrl: './stat-medication-form.component.html',
  styleUrls: ['./stat-medication-form.component.css'],
})
export class StatMedicationFormComponent
  extends CommonUtil
  implements OnInit, OnDestroy {
  headers = [
    'Route',
    'Medication',
    'Dose',
    'Prescription remarks',
    'Time Admin',
    'Given By',
    "Dr's remark",
    'Remark',
  ];
  date = '';
  time = '';
  printData = [];

  constructor(
    private http: HttpService,
    public appStoreService: AppStoreService,
    public statMedicationStoreService: StatMedicationStoreService
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.appStoreService.onPatientChanged = this.appStoreService.onClear = () => {};
  }

  ngOnInit(): void {
    (async () => {
      this.appStoreService.isDoctorRank = await this.isDoctorRank(
        this.appStoreService.userId,
        this.http
      );
    })();
    (this.appStoreService.onPatientChanged = this.fetchStatMedications.bind(
      this
    ))();
    this.appStoreService.onClear = this.new.bind(this);
    this.bindEditData();
  }

  formatDate(dateStr: string, format: string) {
    if (!dateStr) return '';
    return moment(dateStr).format(format);
  }

  bindEditData() {
    if (this.statMedicationStoreService.isUpdate) {
      const tabEle1 = document.getElementById('tab1');
      const tabEle2 = document.getElementById('tab2');
      tabEle2.style.background = '#3b5998';
      tabEle1.style.background = '#8C9899';
      this.statMedicationStoreService.statMedications = this.statMedicationStoreService.statMedications.filter(
        (v) => v.syskey == this.statMedicationStoreService.currentSysKey
      );
      const data = this.statMedicationStoreService.statMedications[0];
      this.date = data.confirmDate;
      this.time = data.confirmTime;
      this.appStoreService.fetchPatientByRgsNo(data.rgsNo);
    }
  }

  async fetchStatMedications() {
    if (this.statMedicationStoreService.isUpdate) return;
    this.statMedicationStoreService.statMedications = [];
    // await this.fetchRouteDoseTask(this.http, this.statMedicationStoreService);
    this.http
      .doPost('inpatient-medical-record/stat-medications-initial', {
        rgsno: this.appStoreService.rgsNo,
        // rgsno: 300268044,
      })
      .subscribe((data: any) => {
        this.statMedicationStoreService.statMedications = [];
        for (const v of data) {
          let times = 1;
          switch (data.engdesc) {
            case 'twice a day':
              times = 2;
              break;
            case '3 times a day':
              times = 3;
              break;
            case '4 times a day':
              times = 4;
              break;
          }
          let i = 0;

          while (i++ < times) {
            this.statMedicationStoreService.statMedications.push(
              new StatMedication(
                v.syskey,
                this.statMedicationStoreService.routes
                  .find((e: any) => e.route == v.route)
                  .syskey.toString(),
                v.medication,
                v.dose,
                v.engdesc,
                '',
                '',
                '',
                '',
                '',
                v.stockId,
                v.remark
              )
            );
          }
        }
      });
  }

  handleRowClick(e) {
    // window.scrollTo({
    //   top: e.clientY,
    //   behavior: 'smooth',
    // });
  }

  new() {
    this.statMedicationStoreService.isUpdate = false;
    this.clear();
    this.fetchStatMedications();
  }

  clear() {
    this.statMedicationStoreService.statMedications = [];
    this.date = '';
    this.time = '';
    this.printData = [];
  }

  save() {
    if (this.appStoreService.loading) return;
    if (this.appStoreService.isDoctorRank == null) {
      return alert('Unauthorized');
    }
    this.appStoreService.loading = true;
    try {
      if (this.statMedicationStoreService.isUpdate) {
        const v = this.statMedicationStoreService.statMedications[0];
        this.http
          .doPost(
            `inpatient-medical-record/update-stat-medication/${this.statMedicationStoreService.currentSysKey}`,
            {
              userid: this.appStoreService.userId,
              username: '',
              stockId: v.stockId,
              stockDescription: v.medication,
              timeAdmin: v.timeAdmin,
              givenBy: v.givenBy,
              drRemark: v.drRemark,
              isDoctor: this.appStoreService.isDoctorRank,
              moConfirmDate: this.appStoreService.isDoctorRank ? this.date : '',
              nurseConfirmDate: !this.appStoreService.isDoctorRank
                ? this.date
                : '',
              moConfirmTime: this.appStoreService.isDoctorRank ? this.time : '',
              nurseConfirmTime: !this.appStoreService.isDoctorRank
                ? this.time
                : '',
              routeSyskey: this.statMedicationStoreService.routes.find(
                (item) => item.value == v.route
              ).syskey,
              doseTypeSyskey: this.statMedicationStoreService.doses.find(
                (item: any) => item.EngDesc == v.doseDesc
              ).syskey,
              doseRemarkSyskey: 0,
              dose: v.doseCount,
              remark: v.remark,
              prescriptionRemark: v.prescriptionRemark,
            }
          )
          .subscribe((data: any) => {
            this.appStoreService.loading = false;
            alert('update successful');
          });
      } else {
        this.http
          .doPost('inpatient-medical-record/save-stat-medication', {
            statMedications: this.statMedicationStoreService.statMedications.map(
              (v) => ({
                pId: this.appStoreService.pId,
                rgsNo: this.appStoreService.rgsNo,
                adNo: this.appStoreService.patientDetail.adNo,
                userid: this.appStoreService.userId,
                username: '',
                parentId: v.syskey,
                doctorId: this.appStoreService.drID,
                stockId: v.stockId,
                stockDescription: v.medication,
                timeAdmin: v.timeAdmin,
                givenBy: v.givenBy,
                drRemark: v.drRemark,
                isDoctor: this.appStoreService.isDoctorRank,
                moConfirmDate: this.appStoreService.isDoctorRank
                  ? this.date
                  : '',
                nurseConfirmDate: !this.appStoreService.isDoctorRank
                  ? this.date
                  : '',
                moConfirmTime: this.appStoreService.isDoctorRank
                  ? this.time
                  : '',
                nurseConfirmTime: !this.appStoreService.isDoctorRank
                  ? this.time
                  : '',
                routeSyskey: this.statMedicationStoreService.routes.find(
                  (item) => item.value == v.route
                ).syskey,
                doseTypeSyskey: this.statMedicationStoreService.doses.find(
                  (item: any) => item.EngDesc == v.doseDesc
                ).syskey,

                doseRemarkSyskey: 0,
                dose: v.doseCount,
                remark: v.remark,
                prescriptionRemark: v.prescriptionRemark,
              })
            ),
          })
          .subscribe(() => {
            this.appStoreService.loading = false;
            this.statMedicationStoreService.tabNo = 1;
            this.clear();
          });
      }
    } catch (err) {
      alert(err.message);
      this.appStoreService.loading = false;
    }
  }

  delete() {
    if (this.statMedicationStoreService.isUpdate)
      this.statMedicationStoreService.deleteDialog = true;
  }

  print() {
    const doc = new jsPDF();
    doc.setFontSize(11);
    doc.text('ASIA ROYAL HOSPITAL', 105, 15, { align: 'center' });
    doc.text('IN-PATIENT MEDICATION RECORD - INSTRUCTION', 105, 23, {
      align: 'center',
    });

    this.http
      .doPost(`inpatient-medical-record/stat-medications`, { all: true })
      .subscribe((data: any) => {
        this.printData = data.data.map((v) => {
          return new StatMedication(
            v.syskey,
            this.statMedicationStoreService.routes.find(
              (item) => item.syskey == v.routeSyskey
            ).value,
            v.stockDescription,
            v.dose,
            '',
            v.prescriptionRemark,
            v.timeAdmin,
            v.givenBy,
            '',
            v.drRemark,
            v.stockId,
            v.remark,
            this.statMedicationStoreService.routes.find(
              (item) => item.syskey == v.routeSyskey
            ).text,
            this.appStoreService.isDoctorRank
              ? v.moConfirmDate
              : v.nurseConfirmDate
          );
        });

        setTimeout(() => {
          (doc as any).autoTable({
            html: '#stat-medication__record',
            startY: 35,
            theme: 'grid',
            headStyles: {
              fillColor: '#686869',
            },
            styles: {
              fontSize: 9,
              valign: 'middle',
              halign: 'center',
            },
          });
          // doc.autoPrint();
          doc.autoPrint({ variant: 'non-conform' });
          doc.save('stat-medication.pdf');
        }, 1000);
      });
  }
}

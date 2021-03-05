import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { StatMedicationStoreService } from '../stat-medication-store.service';
import * as moment from 'moment';
import StatMedication from '../stat-medication.model';
import { AppStoreService } from 'src/app/app-store.service';
import CommonUtil from 'src/app/utils/common.util';

@Component({
  selector: 'app-stat-medication-list',
  templateUrl: './stat-medication-list.component.html',
  styleUrls: ['./stat-medication-list.component.css'],
})
export class StatMedicationListComponent extends CommonUtil implements OnInit {
  headers = [
    'Patient ID',
    'Ad No',
    'Patient Name',
    'Route',
    'Medication',
    'Dose',
    'Prescription remarks',
    'Time Admin',
    'Given By',
    "Dr's remark",
    'Remark',
  ];
  statMedications = [];
  fields = [
    {
      text: 'Route',
      value: '1',
      key: 'routeDesc',
    },
    {
      text: 'Medication',
      value: '2',
      key: 'stockDescription',
    },
    {
      text: 'Dose',
      value: '3',
      key: 'dose',
    },
    {
      text: 'Prescription Remark',
      value: '4',
      key: 'prescriptionRemark',
    },
    {
      text: 'Time Admin',
      value: '5',
      key: 'timeAdmin',
    },
    {
      text: 'Given By',
      value: '6',
      key: 'givenBy',
    },
    {
      text: "Dr's remark",
      value: '7',
      key: 'drRemark',
    },
    {
      text: 'Remark',
      value: '8',
      key: 'remark',
    },
    {
      text: 'Patient ID',
      value: '9',
      key: 'patientId',
    },
    {
      text: 'Patient Name',
      value: '10',
      key: 'patientName',
    },
    {
      text: 'Ad No',
      value: '11',
      key: 'adNo',
    },
  ];

  constructor(
    public appStoreService: AppStoreService,
    public statMedicationStoreService: StatMedicationStoreService,
    private http: HttpService
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchAllStatMedications();
    this.statMedicationStoreService.isUpdate = false;
  }

  fetchAllStatMedications() {
    this.http
      .doGet('inpatient-medical-record/routes')
      .subscribe((routes: any) => {
        this.http
          .doGet('inpatient-medical-record/doses')
          .subscribe((doses: any) => {
            this.http
              .doGet('inpatient-medical-record/drug-tasks')
              .subscribe((drugTasks: any) => {
                this.statMedicationStoreService.routes = routes.map((v) => ({
                  value: v.route,
                  text: v.EngDesc,
                  syskey: v.syskey,
                }));
                this.statMedicationStoreService.doses = doses.map((v) => ({
                  text: v.Dose,
                  value: v.EngDesc,
                  syskey: v.syskey,
                }));
                this.statMedicationStoreService.drugTasks = drugTasks.map(
                  (v) => ({
                    text: v.eng_desc,
                    value: v.task,
                    syskey: v.syskey,
                  })
                );

                this.http
                  .doPost(`inpatient-medical-record/stat-medications`, {
                    page: this.page,
                    perPage: this.perPage,
                    search: this.search,
                    advSearch: this.filters.map((filter) => ({
                      ...filter,
                      field: this.fields.find((v) => v.value == filter.field)
                        ?.key,
                    })),
                  })
                  .subscribe((data: any) => {
                    this.statMedicationStoreService.statMedications = data.data.map(
                      (v) =>
                        new StatMedication(
                          v.syskey,
                          routes.find(
                            (item) => item.syskey == v.routeSyskey
                          ).route,
                          v.stockDescription,
                          v.dose,
                          doses.map(
                            (item) => item.syskey == v.doseTypeSyskey
                          ).EngDesc,
                          v.prescriptionRemark,
                          v.timeAdmin,
                          v.givenBy,
                          '',
                          v.drRemark,
                          v.stockId,
                          v.remark,
                          routes.find(
                            (item) => item.syskey == v.routeSyskey
                          ).EngDesc,
                          this.appStoreService.isDoctorRank
                            ? v.moConfirmDate
                            : v.nurseConfirmDate,
                          '',
                          v.patientId,
                          v.patientName,
                          v.adNo,
                          this.appStoreService.isDoctorRank
                            ? v.moConfirmTime
                            : v.nurseConfirmTime
                        )
                    );
                    this.initPagination(data);
                  });
              });
          });
      });
  }

  goToList({ syskey }: { syskey: number }) {
    this.statMedicationStoreService.currentSysKey = syskey;
    this.statMedicationStoreService.isUpdate = true;
    this.statMedicationStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.page = 1;
    this.perPage = perPage;
    this.fetchAllStatMedications();
  }

  handleSkip(n: number) {
    this.calculateSkipType(n);
    this.fetchAllStatMedications();
  }

  advanceSearch(filters) {
    this.filters = filters;
    this.fetchAllStatMedications();
  }

  normalSearch() {
    this.fetchAllStatMedications();
  }

  showAll() {
    this.search = '';
    this.filters = [];
    this.fetchAllStatMedications();
  }
}

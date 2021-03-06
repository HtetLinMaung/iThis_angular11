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
    'Date',
    'Route',
    'Medication',
    'Dose',
    'Prescription remarks',
    'Time Admin',
    'Given By',
    "Dr's remark",
    'Remark',
  ];
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
    {
      text: 'Date',
      value: '12',
      key: 'date',
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
    this.statMedicationStoreService.statMedications = [];
    this.fetchAllStatMedications();
    this.statMedicationStoreService.isUpdate = false;
  }

  async fetchAllStatMedications() {
    this.appStoreService.isDoctorRank = await this.isDoctorRank(
      this.appStoreService.userId,
      this.http
    );
    const { routes, doses } = await this.fetchRouteDoseTaskAsync(
      this.http,
      this.statMedicationStoreService
    );

    this.http
      .doPost(`inpatient-medical-record/stat-medications`, {
        page: this.page,
        perPage: this.perPage,
        search: this.search,
        advSearch: this.filters.map((filter) => ({
          ...filter,
          field: this.fields.find((v) => v.value == filter.field)?.key,
        })),
      })
      .subscribe((data: any) => {
        this.statMedicationStoreService.statMedications = data.data.map(
          (v) =>
            new StatMedication(
              v.syskey,
              routes.find((item) => item.syskey == v.routeSyskey).syskey,
              v.stockDescription,
              v.dose,
              doses.find((item) => item.syskey == v.doseTypeSyskey).EngDesc,
              v.prescriptionRemark,
              v.timeAdmin,
              v.givenBy,
              '',
              v.drRemark,
              v.stockId,
              v.remark,
              routes.find((item) => item.syskey == v.routeSyskey).EngDesc,
              this.appStoreService.isDoctorRank
                ? v.moConfirmDate
                : v.nurseConfirmDate,
              '',
              v.patientId,
              v.patientName,
              v.adNo,
              this.appStoreService.isDoctorRank
                ? v.moConfirmTime
                : v.nurseConfirmTime,
              v.rgsNo
            )
        );
        this.initPagination(data);
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

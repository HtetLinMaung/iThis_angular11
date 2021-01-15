import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { StatMedicationStoreService } from '../stat-medication-store.service';
import * as moment from 'moment';
import StatMedication from '../stat-medication.model';

@Component({
  selector: 'app-stat-medication-list',
  templateUrl: './stat-medication-list.component.html',
  styleUrls: ['./stat-medication-list.component.css'],
})
export class StatMedicationListComponent implements OnInit {
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
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  statMedications = [];
  open = false;
  fields = [
    {
      text: 'Date',
      value: '1',
      key: 'fmtDate',
    },
    {
      text: 'Date Taken',
      value: '2',
      key: 'fmtDateTaken',
    },
    {
      text: 'Drug Allergy To',
      value: '3',
      key: 'drugAllergyTo',
    },
    {
      text: 'Instruction Under Treatment',
      value: '4',
      key: 'instruction',
    },
    {
      text: 'Remarks',
      value: '5',
      key: 'remarks',
    },
  ];
  search = '';

  constructor(
    public statMedicationStoreService: StatMedicationStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.fetchAllStatMedications();
    this.statMedicationStoreService.isUpdate = false;
  }

  formatDate(dateStr: string, format: string) {
    return moment(dateStr).format(format);
  }

  initPagination(data) {
    this.start = 0;
    this.end = this.perPage;
    if (data.length < this.perPage) {
      this.end = data.length;
    }
    this.calculateTotal(data);
  }

  calculateTotal(data) {
    this.totalPage = Math.ceil(data.length / this.perPage);
    this.total = data.length;
  }

  fetchAllStatMedications() {
    Promise.all([
      this.fetchRoutes(),
      this.fetchDoses(),
      this.fetchDrugTasks(),
    ]).then(([routes, doses, drugTasks]: [any, any, any]) => {
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
      this.statMedicationStoreService.drugTasks = drugTasks.map((v) => ({
        text: v.eng_desc,
        value: v.task,
        syskey: v.syskey,
      }));

      this.http
        .doGet(`inpatient-medical-record/stat-medications`)
        .subscribe((data: any) => {
          this.statMedicationStoreService.statMedications = data.map(
            (v) =>
              new StatMedication(
                v.syskey,
                routes.find((item) => item.syskey == v.routeSyskey).route,
                v.stockDescription,
                v.dose,
                doses.map((item) => item.syskey == v.doseTypeSyskey).EngDesc,
                '',
                v.timeAdmin,
                v.givenBy,
                '',
                v.drRemark,
                v.stockId,
                '',
                routes.find((item) => item.syskey == v.routeSyskey).EngDesc,
                moment().format('h:mm:ss a')
              )
          );

          this.statMedications = this.statMedicationStoreService.statMedications;
          this.initPagination(data);
        });
    });
  }

  fetchRoutes() {
    return this.http.doGet('inpatient-medical-record/routes').toPromise();
  }

  fetchDoses() {
    return this.http.doGet('inpatient-medical-record/doses').toPromise();
  }

  fetchDrugTasks() {
    return this.http.doGet('inpatient-medical-record/drug-tasks').toPromise();
  }

  goToList({ syskey }: { syskey: number }) {
    this.statMedicationStoreService.currentSysKey = syskey;
    this.statMedicationStoreService.isUpdate = true;
    this.statMedicationStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.statMedicationStoreService.statMedications);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end =
              this.statMedicationStoreService.statMedications.length -
              this.start;
          }
          this.start = (this.page - 1) * this.perPage;
        }
        break;
      case 2:
        if (this.page !== 1) {
          this.page--;
          this.end = this.page * this.perPage;
          this.start = (this.page - 1) * this.perPage;
        } else {
          this.start = (this.page - 1) * this.perPage;
          this.end = this.perPage;
          if (
            this.statMedicationStoreService.statMedications.length <
            this.perPage
          ) {
            this.end = this.statMedicationStoreService.statMedications.length;
          }
        }
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (
          this.statMedicationStoreService.statMedications.length < this.perPage
        ) {
          this.end = this.statMedicationStoreService.statMedications.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (
          this.statMedicationStoreService.statMedications.length %
            this.perPage ===
          0
        ) {
          this.end = this.page * this.perPage;
        } else {
          this.end =
            this.start +
            (this.statMedicationStoreService.statMedications.length %
              this.perPage);
        }
    }
  }

  openAdvSearch() {
    this.open = true;
  }

  closeFilter() {
    this.open = false;
  }

  advanceSearch(filters) {
    this.statMedicationStoreService.statMedications = this.statMedications.filter(
      (instruction) => {
        let flag = true;
        for (const filter of filters) {
          const key = this.fields.find((field) => field.value == filter.field)
            ?.key;
          switch (filter.condition) {
            case '1':
              flag = flag && filter.search == instruction[key];
              break;
            case '2':
              flag =
                flag && instruction[key].toString().includes(filter.search);
              break;
            case '3':
              flag =
                flag && instruction[key].toString().startsWith(filter.search);
              break;
            default:
              flag =
                flag && instruction[key].toString().endsWith(filter.search);
          }
        }
        return flag;
      }
    );
    this.initPagination(this.statMedicationStoreService.statMedications);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.statMedicationStoreService.statMedications = this.statMedications.filter(
        (instruction) => {
          let flag = false;
          for (const key in instruction) {
            if (searchKeys.includes(key)) {
              flag = flag || instruction[key].toString().includes(this.search);
            }
          }
          return flag;
        }
      );
    }

    this.initPagination(this.statMedicationStoreService.statMedications);
  }

  showAll() {
    this.fetchAllStatMedications();
  }

  clearSearch() {
    this.search = '';
  }
}

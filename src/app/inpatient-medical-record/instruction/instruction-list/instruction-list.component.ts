import { Component, OnInit } from '@angular/core';
import { InstructionStoreService } from '../instruction-store.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/framework/http.service';
import Instruction from '../Instruction.model';

@Component({
  selector: 'app-instruction-list',
  templateUrl: './instruction-list.component.html',
  styleUrls: ['./instruction-list.component.css'],
})
export class InstructionListComponent implements OnInit {
  headers = [
    'Date',
    'Date Taken',
    'Drug Allergy To',
    'Instruction Under Treatment',
    'Remarks',
  ];
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;

  open = false;
  fields = [
    {
      text: 'Date',
      value: 1,
      key: 'fmtDate',
    },
    {
      text: 'Date Taken',
      value: 2,
      key: 'fmtDateTaken',
    },
    {
      text: 'Drug Allergy To',
      value: 3,
      key: 'drugAllergyTo',
    },
    {
      text: 'Instruction Under Treatment',
      value: 4,
      key: 'instruction',
    },
    {
      text: 'Remarks',
      value: 5,
      key: 'remarks',
    },
  ];

  search = '';

  constructor(
    public instructionStoreService: InstructionStoreService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.fetchAllInstructions();
    this.instructionStoreService.isUpdate = false;
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

  fetchAllInstructions() {
    this.http
      .doGet(`inpatient-medical-record/instructions`)
      .subscribe((data: any) => {
        this.instructionStoreService.instructions = data.map(
          (v) =>
            new Instruction(
              v.syskey,
              v.date,
              v.dateTaken,
              v.drugAllergyTo,
              v.instruction,
              v.remarks,
              this.formatDate(v.date, 'DD/MM/yyyy'),
              this.formatDate(v.dateTaken, 'DD/MM/yyyy'),
              v.pId
            )
        );
        this.initPagination(data);
      });
  }

  goToList({ syskey }: { syskey: number }) {
    this.instructionStoreService.currentSysKey = syskey;
    this.instructionStoreService.isUpdate = true;
    this.instructionStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    console.log(perPage);
    this.perPage = perPage;
    this.initPagination(this.instructionStoreService.instructions);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page !== this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          this.start = (this.page - 1) * this.perPage;
        } else {
          this.start = (this.page - 1) * this.perPage;
          if (
            this.instructionStoreService.instructions.length % this.perPage ===
            0
          ) {
            this.end = this.page * this.perPage;
          } else {
            this.end =
              this.start +
              (this.instructionStoreService.instructions.length % this.perPage);
          }
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
          if (this.instructionStoreService.instructions.length < this.perPage) {
            this.end = this.instructionStoreService.instructions.length;
          }
        }
      case 3:
        this.page = 1;
        this.start = (this.page - 1) * this.perPage;
        this.end = this.perPage;
        if (this.instructionStoreService.instructions.length < this.perPage) {
          this.end = this.instructionStoreService.instructions.length;
        }
        break;
      default:
        this.page = this.totalPage;
        this.start = (this.page - 1) * this.perPage;
        if (
          this.instructionStoreService.instructions.length % this.perPage ===
          0
        ) {
          this.end = this.page * this.perPage;
        } else {
          this.end =
            this.start +
            (this.instructionStoreService.instructions.length % this.perPage);
        }
    }
  }

  openAdvSearch() {
    this.open = true;
  }

  advanceSearch(filters) {
    this.instructionStoreService.instructions = this.instructionStoreService.instructions.filter(
      (instruction) => {
        let flag = true;
        for (const filter of filters) {
          const key = this.fields.find((field) => field.value == filter.field)
            ?.key;
          switch (filter.condition) {
            case 1:
              flag = flag && filter.search == instruction[key];
              break;
            case 2:
              flag = flag && instruction[key].includes(filter.search);
              break;
            case 3:
              flag = flag && instruction[key].startsWith(filter.search);
              break;
            default:
              flag = flag && instruction[key].endsWith(filter.search);
          }
        }
        return flag;
      }
    );
    this.initPagination(this.instructionStoreService.instructions);
  }

  normalSearch() {
    this.instructionStoreService.instructions = this.instructionStoreService.instructions.filter(
      (instruction) => {
        for (const value in instruction) {
          return value.includes(this.search);
        }
      }
    );
    this.initPagination(this.instructionStoreService.instructions);
  }

  showAll() {
    this.fetchAllInstructions();
  }

  clearSearch() {
    this.search = '';
  }
}

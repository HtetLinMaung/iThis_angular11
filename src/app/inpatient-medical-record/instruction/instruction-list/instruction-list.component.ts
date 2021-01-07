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
  headers = ['Date', 'Date Taken', 'Drug Allergy To', 'Instruction', 'Remarks'];
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;

  open = false;

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
              v.remarks
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
}

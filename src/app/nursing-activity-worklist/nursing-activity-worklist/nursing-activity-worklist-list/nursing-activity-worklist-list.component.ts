import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/framework/http.service';
import { NurseActivityWorkListStoreService } from '../../nurse-activity-work-list-store.service';

@Component({
  selector: 'app-nursing-activity-worklist-list',
  templateUrl: './nursing-activity-worklist-list.component.html',
  styleUrls: ['./nursing-activity-worklist-list.component.css'],
})
export class NursingActivityWorklistListComponent implements OnInit {
  constructor(
    private http: HttpService,
    public nurseActivityWorkListStoreService: NurseActivityWorkListStoreService
  ) {}

  ngOnInit(): void {}

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

  goToList({ syskey }: { syskey: number }) {
    this.instructionStoreService.currentSysKey = syskey;
    this.instructionStoreService.isUpdate = true;
    this.instructionStoreService.tabNo = 2;
  }

  handlePerPageChanged(perPage) {
    this.perPage = perPage;
    this.initPagination(this.instructionStoreService.instructions);
  }

  handleSkip(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
          this.end = this.page * this.perPage;
          if (this.page == this.totalPage) {
            this.end =
              this.instructionStoreService.instructions.length - this.start;
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

  closeFilter() {
    this.open = false;
  }

  advanceSearch(filters) {
    this.instructionStoreService.instructions = this.instructions.filter(
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
    this.initPagination(this.instructionStoreService.instructions);
  }

  normalSearch() {
    if (this.search) {
      const searchKeys = this.fields.map((field) => field.key);
      this.instructionStoreService.instructions = this.instructions.filter(
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

    this.initPagination(this.instructionStoreService.instructions);
  }

  showAll() {
    this.fetchAllInstructions();
  }

  clearSearch() {
    this.search = '';
  }
}

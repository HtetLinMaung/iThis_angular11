import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.css'],
})
export class AdvanceSearchComponent implements OnInit {
  @Input() fields = [];
  @Output() onAdvanceSearch = new EventEmitter();
  @Output() onCloseFilter = new EventEmitter();
  conditions = [
    {
      text: 'Equals',
      value: 1,
    },
    {
      text: 'Contains',
      value: 2,
    },
    {
      text: 'Begins With',
      value: 3,
    },
    {
      text: 'Ends With',
      value: 4,
    },
  ];
  filters = [
    {
      condition: 3,
      field: 1,
      search: '',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  getDefaultFilter() {
    return {
      condition: 3,
      field: 1,
      search: '',
    };
  }

  clearFilter() {
    this.filters = [this.getDefaultFilter()];
  }

  addFilter() {
    this.filters.push(this.getDefaultFilter());
  }

  advanceSearch() {
    this.onAdvanceSearch.emit(this.filters);
  }

  removeFilter(i: number) {
    this.filters = this.filters.filter((_, index) => index != i);
  }

  closeFilter() {
    this.onCloseFilter.emit();
  }
}

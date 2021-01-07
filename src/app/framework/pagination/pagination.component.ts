import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() perPage = 0;
  @Input() perPages = [];
  @Input() total = 0;
  @Input() start = 0;
  @Input() end = 0;
  @Input() totalPage = 0;
  @Output() onPerPageChanged = new EventEmitter();
  @Output() onNext = new EventEmitter();
  @Output() onPrev = new EventEmitter();
  @Output() onSkipFirst = new EventEmitter();
  @Output() onSkipLast = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handlePerPageChanged(event) {
    this.onPerPageChanged.emit(event.target.value);
  }

  skipFirst() {
    this.onSkipFirst.emit();
  }

  skipLast() {
    this.onSkipLast.emit();
  }

  next() {
    this.onNext.emit();
  }

  prev() {
    this.onPrev.emit();
  }
}

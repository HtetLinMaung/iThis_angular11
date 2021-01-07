import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() page;
  @Input() perPage;
  @Input() perPages;
  constructor() {}

  ngOnInit(): void {}

  handlePerPageChanged(event) {
    console.log(event.target.value);
  }
}

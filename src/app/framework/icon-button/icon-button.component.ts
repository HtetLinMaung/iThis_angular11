import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css'],
})
export class IconButtonComponent implements OnInit {
  @Input() color = 'white';

  constructor() {}

  ngOnInit(): void {}
}

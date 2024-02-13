import { Component, OnInit } from '@angular/core';
import { CollaspeService } from '../services/collaspe.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(public _collaspeService : CollaspeService) { }

  ngOnInit(): void {
  }

}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {createHttpObservable} from '../common/util';
import {map, pluck} from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}

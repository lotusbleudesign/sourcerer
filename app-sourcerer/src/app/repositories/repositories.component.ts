import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent extends HeaderComponent implements OnInit {
  panelOpenState = false;

  @Input('ngStyle')
  @Input() viewer: any;

  ngOnInit(): void {

  }

}


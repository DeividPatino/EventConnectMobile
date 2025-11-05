import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent  implements OnInit {

  constructor(private readonly navSrv: NavController) { }


  ngOnInit() {}

  goBack(){
    this.navSrv.back();
  }

}
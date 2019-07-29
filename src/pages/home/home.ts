import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  public vari: number;
  public vari1: number;
  constructor(public navCtrl: NavController) { }
 ionicGo(){   
   this.navCtrl.push(ListPage, { NB_VARS: this.vari, NB_CONS: this.vari1 });  }

}


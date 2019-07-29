import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { HelpPage } from '../pages/help/help';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SimplexProvider } from '../providers/simplex/simplex';
import { RationalArithmProvider } from '../providers/rational-arithm/rational-arithm';
import { SimplexFractionProvider } from '../providers/simplex-fraction/simplex-fraction';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    HelpPage
  
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    HelpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SimplexProvider,
    RationalArithmProvider,
    SimplexFractionProvider
  ]
})
export class AppModule {}

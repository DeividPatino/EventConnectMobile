import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app"; 
import {provideAuth,getAuth} from "@angular/fire/auth";
import {provideFirestore,getFirestore} from "@angular/fire/firestore"
import { environment } from 'src/environments/environment.prod';
import { Auth } from './providers/auth';


const providers = [Auth];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    provideFirebaseApp(()=>initializeApp(environment.FirebaseApp_CONFIG)),
    provideAuth(()=>getAuth()),
    provideFirestore(()=>getFirestore()),
    ...providers,
    
  ],
    
  
})
export class CoreModule { 
  // constructor(private readonly filesrv:File){
  //   if(!Capacitor.isNativePlatform()){
  //     this.filesrv.requestpermission();

  //   }
  // }
}
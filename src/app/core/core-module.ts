import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initializeApp, provideFirebaseApp } from "@angular/fire/app"; 
import {provideAuth,getAuth} from "@angular/fire/auth";
import {provideFirestore,getFirestore} from "@angular/fire/firestore"
import { environment } from 'src/environments/environment.prod';
import { UpLoader } from './providers/up-loader';
import { NativeToast } from './providers/native-toast';
import { Query } from './providers/query';
import { Capacitor } from '@capacitor/core';
import { File } from './providers/file';
import { Auth } from './providers/auth';






const providers = [Auth, Query, NativeToast, File, UpLoader,];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideAuth(()=>getAuth()),
    provideFirestore(()=>getFirestore()),
    ...providers,
    
  ],
    
  
})
export class CoreModule { 
  constructor(private readonly filesrv:File){
    if(!Capacitor.isNativePlatform()){
      this.filesrv.requestpermission();

    }
  }
}
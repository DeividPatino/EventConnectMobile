import { Injectable } from '@angular/core';
import {Toast} from "@capacitor/toast";

@Injectable({
  providedIn: 'root'
})
export class NativeToast {
  async show(msg:string){
    await Toast.show({
      text: msg,
      duration:'long'
    });

  }
  
}
import { Injectable } from '@angular/core';
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { NativeToast } from './native-toast';
import { IImage } from 'src/app/interfaces/Imagen';




@Injectable({
  providedIn: 'root'
})
export class File {
  constructor(private readonly toast:NativeToast){}
  async requestpermission(){
    try {
      await FilePicker.requestPermissions();
      await  this.toast.show('permission granted');
    } catch (error) {
      await this.toast.show("You must turn manually");
      
    }   
    }
     async pickImage(): Promise<IImage>{
      try {
       const image = await FilePicker.pickImages({
          limit:1,
          readData:true,
        });
        const img = image.files[0];
  
      return{
       data: img.data || "",
        mimeType: img.mimeType,
        name: img.name,
      };
      } catch (error) {
        await this.toast.show('unable to pick an imagen');
        throw error;
        
      }
    }
  }
  
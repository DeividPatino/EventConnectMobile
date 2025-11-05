import { AbstractControl } from "@angular/forms";

export class CustomValidators{
  static noWhiteSpace(control: AbstractControl){
    const whiteSpace = (control.value || '').trim().length === 0;
    return !whiteSpace ? null : {'whitespace' : true}
  }
}
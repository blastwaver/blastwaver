import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quotation'
})
export class QuotationPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if(!value)
      return null;
    
    return value.replace(/%,%/g,'"');
  }

}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'textShortener'
})
export class TextShortenerPipe implements PipeTransform {

  transform(text: string, limit: number): string {
    return text.substring(0, limit - 3).concat('...') ;
  }

}

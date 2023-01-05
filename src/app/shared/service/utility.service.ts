import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  numbers = '1234567890';

  constructor() { }

  _generateRandomCharacters(source: string, length: number) {
    let result = '';
    const charactersLength = source.length;
    for (let i = 0; i < length; i++) {
      result += source.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  getRandomId(length: number = 30) {
    return this._generateRandomCharacters(this.characters, length)
  }

  getRandomNumericId(length: number = 30): number {
    return +this._generateRandomCharacters(this.numbers, length)
  }

}

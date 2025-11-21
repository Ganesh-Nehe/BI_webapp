import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseApi: string = 'http://192.168.1.150:3001';

  constructor() { }

  getBaseApi(): string {
    return this.baseApi;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseApi: string = 'http://192.168.31.16:3000';

  constructor() { }

  getBaseApi(): string {
    return this.baseApi;
  }
}

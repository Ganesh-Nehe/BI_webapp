import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseApi: string = 'http://localhost:3000';

  constructor() { }

  getBaseApi(): string {
    return this.baseApi;
  }
}

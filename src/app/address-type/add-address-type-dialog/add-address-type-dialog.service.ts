import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddAddressTypeDialogService {

  constructor(private apiService: APIService, private http: HttpClient) { }

  async addAddressType(AddressTypeFormData: any){
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.post(`${baseApi}/API/addressType/`, AddressTypeFormData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error saving disapproval:', error);
      throw error; 
    }
  }
}

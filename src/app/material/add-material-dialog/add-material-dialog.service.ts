import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddMaterialDialogService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async addMaterial(MaterialFormData: any) {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.post(`${baseApi}/API/materialIn/`, MaterialFormData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

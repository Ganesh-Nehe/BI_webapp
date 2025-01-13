import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatementPaymentDialogComponentService {
  constructor(private http: HttpClient, private apiService: APIService) { }

  async save (formData: FormData):  Promise<any>{
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API/travelPayment/`, formData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error uploading payment:', error);
      throw error;
    }
  }
}


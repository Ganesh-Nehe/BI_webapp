import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddVoucherheadService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  getVoucherHeadList(): Observable<any>{
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.get(`${baseApi}/API/expense/voucherhead`,httpOptions)
  }


}

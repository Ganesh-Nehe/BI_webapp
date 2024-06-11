import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VoucherExpenseService {

  constructor(private http: HttpClient ,private apiService: APIService) { }

  showAllVoucherExpenses(): Observable<any>{
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.get(`${baseApi}/API/expense/voucher`,httpOptions)
  }

  getVoucherdetails(voucherId: string): Observable<any>{
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.get(`${baseApi}/API/expense/voucherdetails/${voucherId}`,httpOptions)
  }
}

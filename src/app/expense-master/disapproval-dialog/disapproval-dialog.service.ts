import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisapprovalDialogService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  save(voucherId: string, approvalStatus: string, description: string): Observable<any> {
    const formdata ={
      voucherId,
      approvalStatus,
      description
    }
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.patch(`${baseApi}/API/disapproval/discription`, formdata, httpOptions);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseMasterDetailsService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  getDocumentByLocation(encodedLocation: string): Observable<HttpResponse<Blob>> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      }),
      observe: 'response' as 'body',
      responseType: 'blob' as 'json'
    };
    console.log(`Encoded location being sent to API: ${encodedLocation}`);  
    return this.http.get<HttpResponse<Blob>>(`${baseApi}/API/document/${encodedLocation}`, httpOptions);
  }
}

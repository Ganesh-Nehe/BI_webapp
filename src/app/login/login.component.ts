import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../api.service';
import { Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginObj: any = {
    "email_Id": "",
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router, private apiService: APIService, private authService: AuthService) {}

  onLogin() {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true, // Include credentials in the request
    };

    this.http.post(`${baseApi}/API/login`, this.loginObj, httpOptions)
      .subscribe((res: any) => {
        // console.log('API Response:', res);
        if (res.success === 1) {
          // debugger;
          this.authService.setLoggedIn(true);
          this.router.navigate(['/dashboard']);
          localStorage.setItem("loginToken", res.token);
          localStorage.setItem('loggedInUserId', res.userId);
          // console.log(res.userId);
        } else {
          alert(res.data);
          console.log('Login failed:', res.message);
        }
      });
  }
}

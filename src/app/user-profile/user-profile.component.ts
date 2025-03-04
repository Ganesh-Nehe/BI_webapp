import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedImage: string | ArrayBuffer | null = null;
  empDetails: any = null;

  constructor(private apiService: APIService, private http: HttpClient) {}

  async ngOnInit() {
    this.fetchUserImage();
    await this.getEmployeeDetails();
    console.log(this.empDetails);
  }

  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) { 
          this.selectedImage = e.target.result as string;
        }
      };

      reader.readAsDataURL(file);
      this.uploadImage(file);
    }
  }

  async uploadImage(file: File) {
    const baseApi = this.apiService.getBaseApi();
    const formData = new FormData();
    const employeeId = localStorage.getItem('loggedInUserId');
  
    if (!employeeId) {
      console.error('User ID not found in localStorage.');
      return;
    }
  
    formData.append('image', file);
    formData.append('employeeId', employeeId);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
  
    try {
      const response = await this.http.post<{ imageUrl: string }>(`${baseApi}/API/uploadUserPhoto/`, formData, httpOptions).toPromise();
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }

  async fetchUserImage() {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
  
    if (!employeeId) {
      console.error("No employeeId found in localStorage.");
      return;
    }
  
    try {
      const response = await this.http.get(`${baseApi}/API/getProfilePhoto/?employeeId=${employeeId}`, {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        }),
        responseType: 'blob'
      }).toPromise();
  
      if (response) {
        const imageUrl = URL.createObjectURL(response);
        this.selectedImage = imageUrl;
      } else {
        console.warn("No image received from the server.");
      }
    } catch (error) {
      console.error("Error fetching profile photo:", error);
    }
  }

  async getEmployeeDetails(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/user/${employeeId}`, httpOptions).toPromise();
      this.empDetails = response;
    } catch (error) {
      console.error('Error fetching voucher details', error);
      throw error; // Re-throw the error for further handling
    }
  }

  // async fetchUserImage() {
  //   const baseApi = this.apiService.getBaseApi();
  //   const profilephoto = localStorage.getItem('profilephoto');
  
  //   if (!profilephoto) {
  //     console.error("No profile photo found in localStorage.");
  //     return;
  //   }
  
  //   try {
  //     const response = await this.http.get(`${baseApi}/API/getProfilePhoto/?profilephoto=${profilephoto}`, {
  //       headers: new HttpHeaders({
  //         'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
  //       }),
  //       responseType: 'blob'
  //     }).toPromise();
  
  //     if (response) {
  //       const imageUrl = URL.createObjectURL(response);
  //       this.selectedImage = imageUrl;
  //       console.log("Profile photo loaded successfully:", imageUrl);
  //     } else {
  //       console.warn("No image received from the server.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile photo:", error);
  //   }
  // }
}

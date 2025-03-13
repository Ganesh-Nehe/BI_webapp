import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = true;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}

  logout() {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("loggedIn");
    this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
      window.location.reload(); // Forces a full reload to clear cached data
    });
  }

  SideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getEmployeeFirstName(): string {
    return localStorage.getItem('employeeFirstName') || 'USER';
  }
}

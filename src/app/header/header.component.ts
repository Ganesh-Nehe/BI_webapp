import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  logout() {
    localStorage.removeItem("loginToken");
    this.router.navigate(['/login']);
  }

  SideNavToggle() {
    // console.log('SideNav button clicked!');
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }
}

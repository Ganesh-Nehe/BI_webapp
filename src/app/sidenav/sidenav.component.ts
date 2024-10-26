import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input() sideNavStatus: boolean = true;
  isSubmenuVisible: boolean = false;
  permissions: string[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const permissionsString = localStorage.getItem('permissions');

    if (permissionsString) {
      try {
        this.permissions = JSON.parse(permissionsString);
      } catch (e) {
        console.error('Error parsing permissions from localStorage:', e);
        this.permissions = []; // Default to empty array if parsing fails
      }
    } else {
      console.log('No permissions found in localStorage.');
      this.permissions = []; // Default to empty array if no permissions are set
    }
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  toggleSubmenu() {
    this.isSubmenuVisible = !this.isSubmenuVisible;
  }

  ngOnDestroy(): void {}
}

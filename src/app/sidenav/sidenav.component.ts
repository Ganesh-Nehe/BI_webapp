import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {



  constructor(private router: Router) { }

  @Input() sideNavStatus: boolean = false;
  isSubmenuVisible: boolean = false;


  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  toggleSubmenu() {
    this.isSubmenuVisible = !this.isSubmenuVisible;
  }
  ngOnDestroy(): void {
  }
  
  ngOnInit(): void {

  }
}

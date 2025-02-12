import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialService } from './material.service';
import { AddMaterialDialogComponent } from './add-material-dialog/add-material-dialog.component';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent {

  displayedColumns: string[] = ['serialNumber', 'materialDesc', 'HSNcode', 'quantity', 'materialIn', 'materialOut',];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private materialService: MaterialService) { }

  ngOnInit(): void {
    this.loadMaterialList()
  }

  async loadMaterialList() {
    try {
      const res = await this.materialService.loadMaterialList();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      this.snackBar.open('Error loading material list', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {disableClose: false});
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadMaterialList();
        }
      }
    });
  }

  materialOut(row: any){

  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

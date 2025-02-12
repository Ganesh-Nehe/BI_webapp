import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentationService } from './documentation.service';
import { AddChalanDialogComponent } from './add-chalan-dialog/add-chalan-dialog.component';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent {


  displayedColumns: string[] = ['serialNumber', 'customerName'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private documentationService: DocumentationService) { }

  ngOnInit(): void {
    this.loadChalanList()
  }

  async loadChalanList() {
    try {
      const res = await this.documentationService.loadChalanList();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray.reverse());
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      this.snackBar.open('Error loading chalan list', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddChalanDialogComponent, {disableClose: false});
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadChalanList();
        }
      }
    });
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  async openEditDialog(row: any) {
    const res = await this.documentationService.getCutomerDetailsById();
    const dialogRef = this.dialog.open(AddChalanDialogComponent, {
      disableClose: true,
      width: '900px',
      data: { res, row}
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadChalanList();
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

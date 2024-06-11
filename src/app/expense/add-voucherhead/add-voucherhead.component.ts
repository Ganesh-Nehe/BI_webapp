import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddVoucherheadService } from './add-voucherhead.service';
import { AddVoucherheadDialogComponent } from './add-voucherhead-dialog/add-voucherhead-dialog.component';

@Component({
  selector: 'app-add-voucherhead',
  templateUrl: './add-voucherhead.component.html',
  styleUrls: ['./add-voucherhead.component.css']
})
export class AddVoucherheadComponent implements OnInit{

  displayedColumns: string[] = ['sr no', 'Head Name'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private voucherheadservice:  AddVoucherheadService){}

  ngOnInit(): void {
      this.getVoucherHeadList();
  }

  getVoucherHeadList() {
    this.voucherheadservice.getVoucherHeadList().subscribe({
      next: (res) =>  {
        const dataArray = Array.isArray(res.data) ? res.data : [];
        this.dataSource = new MatTableDataSource(dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      }
    });
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(AddVoucherheadDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getVoucherHeadList();
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

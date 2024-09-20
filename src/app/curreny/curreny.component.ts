import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import { CurrencyService } from './currency.service'
import { AddCurrencyComponent } from './add-currency/add-currency.component'

@Component({
  selector: 'app-curreny',
  templateUrl: './curreny.component.html',
  styleUrls: ['./curreny.component.css']
})
export class CurrenyComponent {

  displayedColumns: string[] = ['sr no', 'Currency'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private currencyservice:  CurrencyService){}

  ngOnInit(): void {
      this.getVoucherHeadList();
  }

  getVoucherHeadList() {
    this.currencyservice.getCurrencyList().subscribe({
      next: (res) =>  {
        const dataArray = Array.isArray(res.data) ? res.data : [];
        this.dataSource = new MatTableDataSource(dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      }
    });
  }

  openAddDialog(){
    const dialogRef = this.dialog.open(AddCurrencyComponent);
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

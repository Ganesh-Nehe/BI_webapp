import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentationService } from './documentation.service';
import { AddChalanDialogComponent } from './add-chalan-dialog/add-chalan-dialog.component';
import { ViewChalanDialogComponent } from './view-chalan-dialog/view-chalan-dialog.component';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ConfirmationReturnedDialogComponent } from './confirmation-returned-dialog/confirmation-returned-dialog.component'

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent {


  displayedColumns: string[] = ['serialNumber', 'chalanId', 'customerName', 'contactPerson', 'deliveryLocation', 'viewDetails', 'edit', 'print', 'isReturned'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogContent') dialogContent: any;
  originalData: any[] = [];
  filterAll: boolean = true;
  filterNonReturnable: boolean = false;
  filterReturnable: boolean = false;
  filterReturned: boolean = false;
  

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private documentationService: DocumentationService) { }

  ngOnInit(): void {
    this.loadChalanList()
  }

  async loadChalanList() {
    try {
      const res = await this.documentationService.loadChalanList();
      this.originalData = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(this.originalData.reverse());
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
    const dialogRef = this.dialog.open(AddChalanDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadChalanList();
        }
      }
    });
  }

  async openDetailsDialog(row: any) {
    const res = await this.documentationService.getChalanMaterials(row.chalanId);
    const dialogRef = await this.dialog.open(ViewChalanDialogComponent, {
      data: { row, res },
      width: '100%',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          //this.loadChalanList();
        }
      }
    });
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  async openEditDialog(row: any) {
    const res = await this.documentationService.getChalanMaterials(row.chalanId);
    const dialogRef = this.dialog.open(AddChalanDialogComponent, {
      disableClose: true,
      width: '100%',
      data: { res, row }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadChalanList();
        }
      }
    });
  }

  async isReturned(returnValue: any, chalanId: number) {
    try {
      // const res = await this.documentationService.isReturned(returnValue, chalanId);
      const dialogRef = this.dialog.open(ConfirmationReturnedDialogComponent, {
        disableClose: true,
        data: { returnValue, chalanId }
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.loadChalanList();
          }
        }
      });
    } catch (error) {
      this.snackBar.open('Error Saving Returned Challan', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  async printChalan(row: any) {
    const res = await this.documentationService.getChalanMaterials(row.chalanId);

    const printWindow = window.open('', '', 'height=800,width=1200');

    if (printWindow) {
      // Convert image to Base64 first
      const base64Image = await this.convertImageToBase64('assets/CAS logo/challan Logo.png');

      const isReturnable = row.isReturnable? 'RETURNABLE': 'NON RETURNABLE';

      const formatDate = (utcDate: string) => {
        if (!utcDate) return ''; // Handle null or undefined values
        return new Date(utcDate).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      };

      const chalanDate = formatDate(row.chalanDate);
      const returnDate = formatDate(row.returnDate);
      const poDate = formatDate(row.PODate);

      let tableRows = res.data.map((item: any, index: number) => `
        <tr>
          <td><div class="row-4">${index + 1}</div></td>
          <td><div class="row-4">${item.itemCode}</div></td>
          <td><div class="row-4">${item.itemDesc}</div></td>
          <td><div class="row-4">${item.SAC_HSNcode}</div></td>
          <td><div class="row-4">${item.quantity} ${item.unit}</div></td>
        </tr>
      `).join("");

      const generateDocument = (title: string) => `
        <div class="document">
          <h4 class="document-title">${title}</h4>
          <table>
            <thead>
                <tr>
                  <td colspan="5">
                    <div class="logo-container">
                      <img src="${base64Image}" alt="Logo" class="logo" />
                      <span class="company-name"> 
                        <b>CONVERGE AUTOMATICS SOLUTION PVT LTD</b> <br> 
                        Lotus Valley, Survey no 83/2 Waghmare Vasti, Lohegaon Pune 411047 Maharashtra <br>
                        Tele: +91 98332 24708 / +91 92255 14708 <br> Email: info@casglobals.com <br>
                        GSTIN: 27AAJCC5689B1ZG | PAN No: AAJCC5689B 
                      </span>
                    </div>
                  </td>
                </tr>
                <tr><td colspan="5"> <div class="row-2"> <b>DELIVERY CHALLAN - ${isReturnable} </b> </div></td></tr>
                <tr>
                  <td colspan="3" style="width: 65%;">
                    <div class="row-3">
                      <b>Recipient:</b> <br>
                      <b>${row.customerName}</b> <br>
                      ${row.localArea} <br>
                      ${row.city} - ${row.pinCode}<br>
                      ${row.state}, ${row.country} <br>
                      GST No.: ${row.gstNo} <br>
                    </div>
                  </td>
                  <td colspan="2" style="width: 35%;">
                    <div class="row-3">
                      <b>Challan No.:</b> ${row.chalanNo} <br>
                      <b>Challan Date:</b> ${chalanDate} <br>
                      Return Date: ${returnDate} <br>
                      PO No.: ${row.PoNo} <br>
                      PO Date: ${poDate}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><div class="row-4"><b>Sr. No.</b></td></div>
                  <td><div class="row-4"><b>Part/ Material No.</b></td></div>
                  <td><div class="row-4"><b>Description Of Goods</b></td></div>
                  <td><div class="row-4"><b>SAC / HSN Code</b></td></div>
                  <td><div class="row-4"><b>Quantity</b></td></div>
                </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
              <tr><td colspan="5"><div class="row-middle">Remark: </div></td></tr>
              <tr><td colspan="5"><div class="row-middle">Prepared By: ${row.preparedBy}</div></td></tr>
              <tr><td colspan="5"><div class="row-5">Receiver's Sign with office stamp <br> Received the above material in good condition </div></td></tr>
              <tr>
                <td colspan="5">
                  <div class="row-container">
                    <div class="row-last">
                      1) Certified the particulars given above are correct <br>
                      2) Any discrepancy should be reported immediately with full particulars within seven days  
                    </div>
                    <div class="row-signature">
                      for CONVERGE AUTOMATICS SOLUTION PVT. LTD <br><br><br><br><br><br><br> Authorized Signatory
                    </div>
                  </div>
                </td>
              </tr>
          </table>
        </div>
      `;

      printWindow.document.write(`
        <html>
          <head>
            <title>${row.chalanNo}</title>
            <style>
              thead {
                display: table-header-group;
              }
              body {
                margin: 0;
                padding: 0;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 0;
                padding: 0;
                table-layout: absolute;
              }
              th, td {
                border: 1px solid black;
                text-align: left;
                height: 20px;
                font-size: 11px;
              }

              .logo-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 5px 10px;
              }
              .logo {
                width: 290px;
                height: 70px;
              } 
              .company-name {
                padding-left: 40px;
                padding-right: 20px;
                font-size: 14px;
                text-align: left;
                flex-grow: 1; 
              }
              .row-2 {
                text-align: center;
              }
              .row-3 {
                padding-left: 7px;
                font-size: 12px;
              }
              .row-4 {
                text-align: center;
              }
              .row-middle{
                padding-left: 5px;
              }
              .row-5 {
                padding-top: 70px;
                padding-left: 5px;
              }
              .document {
                page-break-after: always; /* Forces new page after each document */
                padding: 20px;
              }
              .document-title {
                text-align: right;
                font-size: 8px;
                margin-bottom: 1px;
              }
              .row-container {
                  display: flex;
                  justify-content: space-between; /* Moves "Authorized Signatory" to the right */
                  align-items: flex-end;
                  width: 100%;
                  padding-top: 5px;
                  padding-left: 5px;
                  padding-bottom: 5px;
              }
                    
              .row-last {
                  text-align: left;
                  flex: 1; /* Takes up available space on the left */
              }
                    
              .row-signature {
                  text-align: right; /* Ensures "Authorized Signatory" is at the right end */
                  white-space: nowrap; /* Prevents text from wrapping */
                  font-weight: bold; /* Optional: Make it stand out */
                  padding-right: 20px
              }
              @media print {
                thead {
                  display: table-header-group !important; /* Forces header to repeat */
                }

                table {
                  page-break-inside: auto; /* Ensures table breaks properly */
                }

                tr {
                  page-break-inside: avoid; /* Prevents row splitting */
                  page-break-after: auto; 
                }

                @page {
                  size: portrait; /* Ensures portrait mode */
                }
              }
            </style>
          </head>
          <body>
            ${generateDocument('Original For Recipient')}
            ${generateDocument('Duplicate For Transporter')}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for the image to load before printing
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      console.error('Failed to open print window.');
    }
  }

  // Function to convert image to Base64
  convertImageToBase64(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Avoid CORS issues
      img.src = imagePath;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg")); // Convert to Base64
      };

      img.onerror = (err) => reject(err);
    });
  }

  toggleAllFilter() {
    if (this.filterAll) {
      // Uncheck other checkboxes when "All" is selected
      this.filterReturnable = false;
      this.filterReturned = false;
      this.filterNonReturnable = false;
    }
    this.applyFilter();
  }
  
  toggleCheckboxFilter() {
    // If "Returnable" or "Returned" is selected, uncheck "All"
    if (this.filterReturnable || this.filterReturned || this.filterNonReturnable) {
      this.filterAll = false;
    }
  
    // If neither "Returnable" nor "Returned" is selected, default to "All"
    if (!this.filterReturnable && !this.filterReturned && !this.filterNonReturnable) {
      this.filterAll = true;
    }
  
    this.applyFilter();
  }


  applyFilter(event?: Event) {
    let filterValue = '';
    
    // Get text input filter value (if event is triggered)
    if (event) {
      filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    }
  
    // Apply checkbox filtering
    let filteredData = this.originalData.filter(item => {
      const isNonReturnable = item.isReturnable === null;
      const isReturnable = item.isReturnable === '1' && item.isReturned === null;
      const isReturned = item.isReturned === '1';
  
      // Checkbox filter logic
      const checkboxCondition =
        (this.filterAll) ||
        (this.filterNonReturnable && isNonReturnable) ||
        (this.filterReturnable && isReturnable) ||
        (this.filterReturned && isReturned);
  
      // Text filter logic
      const textCondition =
        filterValue === '' ||
        item.customerName.toLowerCase().includes(filterValue) ||
        item.chalanNo.toLowerCase().includes(filterValue);
  
      return checkboxCondition && textCondition;
    });
  
    // Update MatTableDataSource
    this.dataSource.data = filteredData;
  
    // Reset pagination if available
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

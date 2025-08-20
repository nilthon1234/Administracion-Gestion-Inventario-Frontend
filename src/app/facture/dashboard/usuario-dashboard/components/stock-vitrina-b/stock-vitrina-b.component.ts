import { Component, HostListener, inject, signal } from '@angular/core';
import { NavbarsStockComponent } from "../../../../../shared/components/navbars/navbars-stock/navbars-stock.component";
import { VitrinaBService } from '../../../../service/vitrina-b.service';
import { Vitrina } from '../../../../../shared/models/vitrina';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-stock-vitrina-b',
  imports: [NavbarsStockComponent,CommonModule,MatPaginatorModule,MatTableModule,
    MatProgressSpinnerModule,CustomDateFormatPipe],
  templateUrl: './stock-vitrina-b.component.html',
  styleUrl: './stock-vitrina-b.component.css'
})
export class StockVitrinaBComponent {
  private vitrinaBService = inject(VitrinaBService);

  vitrina = signal<Vitrina[]>([]);
  pageNumber = signal(0);
  pageSize = signal(0);
  totalElements = signal(0);
  loading = signal(true);
  displayedColumns: string[] = ['image', 'brand', 'codToday','type','genero','stockAlmacen','registrationDate'];
  
  constructor(){
    this.loadData();
  }

  loadData(){
    this.loading.set(true);
    this.vitrinaBService.getOutOfStock(this.pageNumber(),this.pageSize()).subscribe(response => {
      this.vitrina.set(response.content);
      this.totalElements.set(response.totalElements);
      this.pageNumber.set(response.pageNumber);
      this.pageSize.set(response.pageSize);
      this.loading.set(false);
    });
  }
  onPageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  generatePdf() {
    const doc = new jsPDF();
    const currentPage = this.pageNumber() + 1; // Porque Angular usa 0-indexado
    const pageSize = this.pageSize();
  
    const title = 'Listado de Productos Sin Stock VITRINA B';
    const subtitle = `Generado desde página ${currentPage} (máx. ${pageSize} registros por página)`;
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(11);
    doc.text(subtitle, 14, 23);
  
    const headers = [['#', 'Marca', 'Código', 'Tipo', 'Género','StockAlmacen','Marcador']];
  
    const data = this.vitrina().map((item, index) => [
      index + 1,
      item.brand,
      item.codToday,
      item.type,
      item.genero ?? '',
      item.stockAlmacen ?? '',
      '[     ]'
    ]);
  
    autoTable(doc, {
      startY: 25,
      head: headers,
      body: data,
      styles: { 
        fontSize: 10,
        halign: 'center' 
      },
      columnStyles: {
        0: { cellWidth: 20 }
      }
    });
  
    doc.save(`Producto Vitrina B -sin-stock-pagina-${currentPage}.pdf`);
  }
  enlargedItem: any = null;
  showCloseButton: boolean = false;

  toggleImageSize(item: any) {
    if (this.enlargedItem === item) {
      this.closeImage();
    } else {
      this.enlargedItem = item;
      this.showCloseButton = true;
      document.body.style.overflow = 'hidden'; // Evita el scroll cuando la imagen está agrandada
    }
  }

  closeImage() {
    this.enlargedItem = null;
    this.showCloseButton = false;
    document.body.style.overflow = ''; // Restaura el scroll
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.enlargedItem && !target.closest('.product-image') && !target.closest('.close-button')) {
      this.closeImage();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.enlargedItem) {
      this.closeImage();
    }
  }

}

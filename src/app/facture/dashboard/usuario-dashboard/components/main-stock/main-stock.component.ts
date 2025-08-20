import { Component, HostListener, inject, signal } from '@angular/core';
import { NavbarsStockComponent } from "../../../../../shared/components/navbars/navbars-stock/navbars-stock.component";
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { Slipper } from '../../../../../shared/models/slippert';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-stock',
  imports: [NavbarsStockComponent, CommonModule, MatPaginatorModule, MatTableModule, MatIconModule,
    MatProgressSpinnerModule, CustomDateFormatPipe],
  templateUrl: './main-stock.component.html',
  styleUrl: './main-stock.component.css'
})
export class MainStockComponent {
  private slipperService = inject(FilterSlipperService);

  //Estado
  slipper = signal<Slipper[]>([]);
  pageNumber = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  loading = signal(true);
  displayedColumns: string[] = ['image', 'brand', 'codToday', 'type', 'genero', 'registrationDate'];

  constructor() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.slipperService.getOutOfStock(this.pageNumber(), this.pageSize()).subscribe(response => {
      this.slipper.set(response.content);
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

    const title = 'Listado de Productos Sin Stock';
    const subtitle = `Generado desde página ${currentPage} (máx. ${pageSize} registros por página)`;
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(11);
    doc.text(subtitle, 14, 23);

    const headers = [['#', 'Marca', 'Código', 'Tipo', 'Género', 'Marcador']];

    const data = this.slipper().map((item, index) => [
      index + 1,
      item.brand,
      item.codToday,
      item.type,
      item.genero,
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

    doc.save(`slippers-sin-stock-pagina-${currentPage}.pdf`);
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

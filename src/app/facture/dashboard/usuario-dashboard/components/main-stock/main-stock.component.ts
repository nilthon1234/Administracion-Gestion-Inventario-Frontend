import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { NavbarsStockComponent } from "../../../../../shared/components/navbars/navbars-stock/navbars-stock.component";
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';  // ✅ importar aquí
import { MatInputModule } from '@angular/material/input';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { Slipper } from '../../../../../shared/models/slippert';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-main-stock',
  standalone: true,
  imports: [NavbarsStockComponent, CommonModule, MatPaginatorModule, MatTableModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, CustomDateFormatPipe, MatSelectModule, MatButtonModule, CopiarTextoDirective],
  templateUrl: './main-stock.component.html',
  styleUrl: './main-stock.component.css'
})
export class MainStockComponent implements OnInit {
  private slipperService = inject(FilterSlipperService);

  // Estado
  slipper = signal<Slipper[]>([]);
  pageNumber = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  loading = signal(true);

  // Nuevo estado: 0 = sin stock, 1 = por agotar
  viewMode = signal<0 | 1>(0);

  // Nuevo: threshold para los "por agotar"
  threshold = signal(3);

  displayedColumns: string[] = ['image', 'brand', 'codToday', 'amount', 'type', 'genero', 'registrationDate'];

  constructor(private route: ActivatedRoute) {
    // this.loadData();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['view'] === '1') {
        this.switchView(1);
      } else {
        this.switchView(0); // por defecto sin stock
      }
    });
  }

  loadData() {
    this.loading.set(true);

    if (this.viewMode() === 0) {
      // Productos sin stock
      this.slipperService.getOutOfStock(this.pageNumber(), this.pageSize())
        .subscribe(response => this.setResponse(response));
    } else {
      // Productos por agotar con threshold dinámico
      this.slipperService.getLowStock(this.pageNumber(), this.pageSize(), this.threshold())
        .subscribe(response => this.setResponse(response));
    }
  }

  private setResponse(response: any) {
    this.slipper.set(response.content);
    this.totalElements.set(response.totalElements);
    this.pageNumber.set(response.pageNumber);
    this.pageSize.set(response.pageSize);
    this.loading.set(false);
  }

  onPageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  switchView(mode: 0 | 1) {
    this.selectedView = mode;
    this.viewMode.set(mode);
    this.pageNumber.set(0); // Reiniciamos a primera página
    this.loadData();
  }

  // Nuevo: cambiar threshold desde el UI
  changeThreshold(value: number) {
    this.threshold.set(value);
    this.pageNumber.set(0); // Reiniciar paginador
    this.loadData();
  }

  // ============== PDF ===============
  generatePdf() {
    const doc = new jsPDF();
    const currentPage = this.pageNumber() + 1;
    const pageSize = this.pageSize();

    const title = this.viewMode() === 0
      ? 'Listado de Productos Sin Stock'
      : `Listado de Productos Por Agotar (≤ ${this.threshold()})`;

    const subtitle = `Generado desde página ${currentPage} (máx. ${pageSize} registros por página)`;
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(11);
    doc.text(subtitle, 14, 23);

    const headers = [['#', 'Marca', 'Código', 'Cantidad', 'Tipo', 'Género', 'Marcador']];
    const data = this.slipper().map((item, index) => [
      index + 1,
      item.brand,
      item.codToday,
      item.amount,
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

    const fileName = this.viewMode() === 0
      ? `slippers-sin-stock-pagina-${currentPage}.pdf`
      : `slippers-por-agotar-(menorIgual-${this.threshold()})-pagina-${currentPage}.pdf`;

    doc.save(fileName);
  }

  // =================== Imagen ====================
  enlargedItem: any = null;
  showCloseButton: boolean = false;

  toggleImageSize(item: any) {
    if (this.enlargedItem === item) {
      this.closeImage();
    } else {
      this.enlargedItem = item;
      this.showCloseButton = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeImage() {
    this.enlargedItem = null;
    this.showCloseButton = false;
    document.body.style.overflow = '';
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

  selectedView = 0; // por defecto inicia en "Sin Stock"


}



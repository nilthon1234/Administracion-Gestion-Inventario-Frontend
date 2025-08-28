import { Component, OnInit } from '@angular/core';
import { PayTypeNavbarComponent } from "../../../../../shared/components/navbars/pay-type-navbar/pay-type-navbar.component";
import { Devoluciones } from '../../../../../shared/models/devoluciones';
import { DevolucionesService } from '../../../../service/devoluciones.service';
import { CommonModule } from '@angular/common';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { HighlightPipe } from '../../../../../shared/pipes/highlight.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { PaginatedResponse } from '../../../../../shared/models/PaginatedResponse';

@Component({
  selector: 'app-devoluciones',
  imports: [PayTypeNavbarComponent,CommonModule,PayTypeTranslatePipe,CustomDateFormatPipe,CopiarTextoDirective],
  templateUrl: './devoluciones.component.html',
  styleUrl: './devoluciones.component.css'
})
export class DevolucionesComponent implements OnInit{
  devoluciones: Devoluciones[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  constructor(private devolucionesService: DevolucionesService) { }

  ngOnInit(): void {
    this.cargarDevoluciones();
  }

  cargarDevoluciones(): void {
    this.devolucionesService.getAllDevoluciones(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PaginatedResponse<Devoluciones>) => {
          this.devoluciones = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
        },
        error: (err) => {
          console.error('Error al cargar devoluciones', err);
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarDevoluciones();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 0; // Reiniciar a la primera página
    this.cargarDevoluciones();
  }

}

import { Component, OnInit } from '@angular/core';
import { PayTypeNavbarComponent } from "../../../../../shared/components/navbars/pay-type-navbar/pay-type-navbar.component";
import { PagoService } from '../../../../service/pago.service';
import { InformePagos } from '../../../../../shared/models/InformePagos';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { PaginatedResponse } from '../../../../../shared/models/PaginatedResponse';

@Component({
  selector: 'app-informe-pagos-actualizados',
  imports: [PayTypeNavbarComponent,CopiarTextoDirective,CommonModule,PayTypeTranslatePipe,CustomDateFormatPipe],
  templateUrl: './informe-pagos-actualizados.component.html',
  styleUrl: './informe-pagos-actualizados.component.css'
})
export class InformePagosActualizadosComponent implements OnInit {
  informePagos: InformePagos[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  constructor(private pagosService: PagoService) { }

  ngOnInit(): void {
    this.cargarInformePagos();
  }

  cargarInformePagos(): void {
    this.pagosService.getAllInformePagos(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PaginatedResponse<InformePagos>) => {
          this.informePagos = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
        },
        error: (err) => {
          console.error('Error al cargar informe de pagos', err);
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarInformePagos();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 0; // Reiniciar a la primera página
    this.cargarInformePagos();
  }

}

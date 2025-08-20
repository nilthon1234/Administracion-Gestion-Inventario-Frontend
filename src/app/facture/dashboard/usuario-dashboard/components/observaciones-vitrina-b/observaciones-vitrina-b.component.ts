import { Component } from '@angular/core';
import { NavbarsVisualizadorVitrinaComponent } from "../../../../../shared/components/navbars/navbars-visualizador-vitrina/navbars-visualizador-vitrina.component";
import { VitrinaResponse } from '../../../../../shared/models/vitrina';
import { firstValueFrom, Observable, of } from 'rxjs';
import { VitrinaBService } from '../../../../service/vitrina-b.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-observaciones-vitrina-b',
  imports: [NavbarsVisualizadorVitrinaComponent,CopiarTextoDirective, CommonModule, FormsModule],
  templateUrl: './observaciones-vitrina-b.component.html',
  styleUrl: './observaciones-vitrina-b.component.css'
})
export class ObservacionesVitrinaBComponent {

  vitrinaResponse$: Observable<VitrinaResponse> = of({
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  });
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  totalElements = 0;

  constructor(private vitrinaBService: VitrinaBService) {
    this.loadData();
  }

  loadData(): void {
    this.vitrinaResponse$ = this.vitrinaBService.getVitrinaFaltantes(this.currentPage, this.pageSize);
    this.vitrinaResponse$.subscribe({
      next: (response) => {
        this.totalElements = response.totalElements;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.totalElements = 0;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadData();
  }

  getPages(): number[] {
    const pages = [];
    const totalPages = Math.ceil(this.totalElements / this.pageSize);
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Helper method for template to safely calculate min
  calculateMin(a: number, b: number): number {
    return Math.min(a, b);
  }


  //pdf
  async generatePDF(): Promise<void> {
    try {
      // Esperamos a que el Observable emita un valor
      const response = await firstValueFrom(this.vitrinaResponse$);
  
      if (!response.content || response.content.length === 0) {
        alert('No hay datos para generar el PDF.');
        return;
      }
  
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
  
      pdf.setFontSize(16);
      pdf.text('Productos Por Mostrar En Vitrina B', 14, 10);
  
      const headers = ['Marca', 'Código', 'Tipo', 'Género', 'Fecha de Registro'];
      const data = response.content.map(item => [
        item.brand ?? '',
        item.codToday ?? '',
        item.type ?? '',
        item.genero ?? '',
        item.registrationDate
          ? new Date(item.registrationDate).toLocaleString()
          : '-'
      ]);
  
      autoTable(pdf, {
        head: [headers],
        body: data,
        startY: 20,
        theme: 'grid',
        didDrawPage: (data) => {
          pdf.setFontSize(10);
          pdf.text(`Página ${data.pageNumber}`, data.settings.margin.left, 15);
        }
      });
  
      // Generar el blob del PDF
      const blob = pdf.output('blob');
      
      // Crear una URL del blob
      const url = URL.createObjectURL(blob);
  
      // Crear un enlace temporal para la descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos-vitrina.pdf'; // Nombre del archivo descargado
      document.body.appendChild(a);
      a.click();
  
      // Limpiar: eliminar el enlace y revocar la URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  
    } catch (err) {
      alert('Hubo un error al cargar los datos o generar el PDF.');
    }
  }

  imageModalOpen = false;
  modalImageUrl = '';

  openImage(url: string) {
    this.modalImageUrl = url;
    this.imageModalOpen = true;
  }

  closeImageModal() {
    this.imageModalOpen = false;
    this.modalImageUrl = '';
  }

}

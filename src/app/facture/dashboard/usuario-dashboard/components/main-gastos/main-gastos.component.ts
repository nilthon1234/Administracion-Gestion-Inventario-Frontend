import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contador, Gastos } from '../../../../../shared/models/gastos';
import { GastosService } from '../../../../service/gastos.service';
import * as jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-main-gastos',
  imports: [CommonModule, FormsModule,],
  templateUrl: './main-gastos.component.html',
  styleUrl: './main-gastos.component.css'
})
export class MainGastosComponent implements OnInit {

  @ViewChild('formularioGasto') formularioGasto!: ElementRef<HTMLDivElement>;
  gastos: Gastos[] = [];
  nuevoGasto: Gastos = {
    descripcion: '',
    salida: 0,
    contador: Contador.ACTIVADO
  };
  fechaSeleccionada: string = new Date().toLocaleDateString('en-CA');
  mostrarFormulario: boolean = false;
  gastoEditando: Gastos | null = null;

  contadorOptions = Object.values(Contador);

  constructor(private gastosService: GastosService) { }

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    const fecha = new Date(this.fechaSeleccionada);
    this.gastosService.obtenerGastosPorMes(fecha).subscribe({
      next: (data) => {
        this.gastos = data;
      },
      error: (error) => {
        console.error('Error al cargar gastos:', error);
      }
    });
  }

  //validar formulario

  get formularioValido(): boolean {
    return !!this.nuevoGasto.descripcion.trim() &&
      this.nuevoGasto.salida > 0;
  }

  guardarGasto(): void {
    if (this.gastoEditando) {
      this.actualizarGasto();
    } else {
      this.crearGasto();
    }
  }

  crearGasto(): void {
    this.gastosService.crearGasto(this.nuevoGasto).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.cargarGastos();
      },
      error: (error) => {
        console.error('Error al crear gasto:', error);
      }
    });
  }

  editarGasto(gasto: Gastos): void {
    this.gastoEditando = gasto;
    this.nuevoGasto = { ...gasto };
    this.mostrarFormulario = true;
    setTimeout(() => {
      this.formularioGasto.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  actualizarGasto(): void {
    if (this.gastoEditando?.id) {
      this.gastosService.actualizarGasto(this.gastoEditando.id, this.nuevoGasto).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarGastos();
          this.mostrarNotificacion('Gasto actualizado exitosamente!');
        },
        error: (error) => {
          console.error('Error al actualizar gasto:', error);
        }
      });
    }
  }

  eliminarGasto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      this.gastosService.eliminarGasto(id).subscribe({
        next: () => {
          this.cargarGastos();
        },
        error: (error) => {
          console.error('Error al eliminar gasto:', error);
        }
      });
    }
  }
  toggleFormulario(): void {
    if (this.mostrarFormulario) {
      // Está abierto → cancelar / cerrar
      this.limpiarFormulario();
    } else {
      // Está cerrado → abrir limpio
      this.limpiarFormulario();   // resetea
      this.mostrarFormulario = true;
    }
  }

  limpiarFormulario(): void {
    this.nuevoGasto = {
      descripcion: '',
      salida: 0,
      contador: Contador.ACTIVADO
    };
    this.gastoEditando = null;
    this.mostrarFormulario = false;
  }

  getTotalGastos(): number {
    return this.gastos.reduce((total, gasto) => total + gasto.salida, 0);
  }

  getContadorColor(contador: Contador): string {
    const colors = {
      [Contador.ACTIVADO]: '#3B82F6',
      [Contador.ANULADO]: '#F59E0B'
    };
    return colors[contador] || '#6B7280';
  }

  private mostrarNotificacion(mensaje: string): void {
    // Aquí podrías integrar una librería de notificaciones
    alert(mensaje);
  }

  //para el contador
  getColorByContador(contador: string): string {
    switch (contador) {
      case 'ACTIVADO':
        return '#4CAF50'; // Verde
      case 'PENDIENTE':
        return '#FFC107'; // Amarillo
      case 'EN_PROCESO':
        return '#2196F3'; // Azul
      case 'ANULADO':
        return '#F44336'; // Rojo
      default:
        return '#9E9E9E'; // Gris por defecto
    }
  }

  toggleContador(gasto: Gastos): void {
    const nuevoEstado = gasto.contador === Contador.ACTIVADO ? Contador.ANULADO : Contador.ACTIVADO;
    this.gastosService.actualizarContador(gasto.id!, nuevoEstado).subscribe(() => {
      gasto.contador = nuevoEstado;
    }, error => {
      alert('Error al actualizar el estado');
      console.error(error);
    });
  }


  async generarPDF(): Promise<void> {
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF('l', 'mm', 'a4'); // landscape

      const fecha = new Date(this.fechaSeleccionada);
      const mes = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

      // Título principal
      doc.setFontSize(18);
      doc.text('Control de Gastos', 14, 22);
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text(`Resumen del mes de ${mes}`, 14, 32);

      // === FILTRAR SOLO GASTOS ACTIVADOS ===
      const gastosActivos = this.gastos.filter(g => g.contador === Contador.ACTIVADO);

      // === RESUMEN: Total solo de gastos activos ===
      const total = gastosActivos.reduce((sum, g) => sum + g.salida, 0);
      const registros = gastosActivos.length;

      const startYSummary = 40;
      const boxX = 14;
      const boxWidth = 270;
      const boxHeight = 20;

      // Fondo del resumen
      doc.setFillColor(240, 249, 255);
      doc.rect(boxX, startYSummary, boxWidth, boxHeight, 'F');

      // Borde
      doc.setDrawColor(200, 200, 200);
      doc.rect(boxX, startYSummary, boxWidth, boxHeight, 'S');

      // Texto del resumen
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Total de Gastos (Activos): $${total.toFixed(2)}`, boxX + 10, startYSummary + 13);
      doc.text(`Registros Activos: ${registros}`, boxX + 120, startYSummary + 13);

      // === TABLA: con ID y solo gastos activos ===
      const data = gastosActivos.map(gasto => [
        gasto.id?.toString() || 'N/A', // Mostrar ID
        gasto.descripcion,
        `$${gasto.salida.toFixed(2)}`,
        this.traducirContador(gasto.contador),
        this.formatearFecha(gasto.registrationSalida)
      ]);

      // Generar tabla con encabezado que incluye "ID"
      autoTable(doc, {
        head: [['ID', 'Descripción', 'Monto', 'Estado', 'Fecha']],
        body: data,
        startY: startYSummary + 25,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: {
          fillColor: [59, 130, 246], // azul
          fontSize: 11,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 249, 255]
        }
      });

      // Mensaje final
      const finalY = (doc as any).lastAutoTable.finalY || (startYSummary + 25);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Documento generado automáticamente. Solo se incluyen gastos activos.', 14, finalY + 10);

      // Descargar
      doc.save(`gastos_activos_${mes.replace(' ', '_')}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Inténtalo de nuevo.');
    }
  }

  formatearFecha(fecha?: Date): string {
    return fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'Sin fecha';
  }

  traducirContador(contador: Contador): string {
    const traducciones: Record<Contador, string> = {
      [Contador.ACTIVADO]: 'Activado',
      [Contador.ANULADO]: 'Anulado'
    };
    return traducciones[contador] || contador;
  }

}

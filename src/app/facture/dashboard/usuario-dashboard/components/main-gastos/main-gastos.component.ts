import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contador, Gastos } from '../../../../../shared/models/gastos';
import { GastosService } from '../../../../service/gastos.service';

@Component({
  selector: 'app-main-gastos',
  imports: [CommonModule, FormsModule,],
  templateUrl: './main-gastos.component.html',
  styleUrl: './main-gastos.component.css'
})
export class MainGastosComponent implements OnInit {
  gastos: Gastos[] = [];
  nuevoGasto: Gastos = {
    descripcion: '',
    salida: 0,
    contador: Contador.ACTIVADO
  };
  fechaSeleccionada: string = new Date().toISOString().split('T')[0];
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
        this.mostrarNotificacion('Gasto creado exitosamente!');
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

}

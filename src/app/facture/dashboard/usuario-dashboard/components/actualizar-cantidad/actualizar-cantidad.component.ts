import { CommonModule } from '@angular/common';
import { Component, Inject, } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA,  MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-actualizar-cantidad',
  imports: [CommonModule,FormsModule, ],
  templateUrl: './actualizar-cantidad.component.html',
  styleUrl: './actualizar-cantidad.component.css'
})
export class ActualizarCantidadComponent {

 cantidad: number = 1;
  operacion: 'aumentar' | 'disminuir' = 'aumentar';

  constructor(
    public dialogRef: MatDialogRef<ActualizarCantidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.cantidad >= 0) {
      // Validar que no se disminuya más de la cantidad actual
      if (this.operacion === 'disminuir' && this.cantidad > this.data.cantidadActual) {
        alert('No puedes disminuir más de la cantidad actual');
        return;
      }

      const resultado = {
        operacion: this.operacion,
        cantidad: this.cantidad,
        nuevaCantidad: this.getNuevaCantidad(),
        datosOriginales: this.data // Pasamos los datos originales para referencia
      };
      this.dialogRef.close(resultado);
    }
  }

  getNuevaCantidad(): number {
    return this.operacion === 'aumentar' 
      ? this.data.cantidadActual + this.cantidad 
      : this.data.cantidadActual - this.cantidad;
  }

}

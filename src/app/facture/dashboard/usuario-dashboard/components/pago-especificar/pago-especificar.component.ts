import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PagoService } from '../../../../service/pago.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pago } from '../../../../../shared/models/pago';


@Component({
  selector: 'app-pago-especificar',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './pago-especificar.component.html',
  styleUrl: './pago-especificar.component.css'
})
export class PagoEspecificarComponent {

  pagos: Pago[] = [];
  monto: number = 0;
  errores: string[] = [];
  tiposPago = [
  { value: 'Yape', label: 'Yape' },
  { value: 'Plim', label: 'Plim' },
  { value: 'Cash', label: 'Efectivo' },
  { value: 'Debito', label: 'Debito' },
  { value: 'Card', label: 'Tarjeta' }
];


  constructor(
    public dialogRef: MatDialogRef<PagoEspecificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nroTicket: string },
    private pagoService: PagoService,
  ) {
    // Agrega 2 formularios mínimos
    this.pagos.push({ ticket: data.nroTicket, payType: '', monto: 0 });
    this.pagos.push({ ticket: data.nroTicket, payType: '', monto: 0 });
  }

  agregarPago() {
    this.pagos.push({ ticket: this.data.nroTicket, payType: '', monto: 0 });
  }

  eliminarPago(index: number) {
    if (this.pagos.length > 2) { // mínimo 2
      this.pagos.splice(index, 1);
    }
  }

  registrarPago() {
  this.errores = []; // Reinicia errores

  let hayError = false;

  this.pagos.forEach((pago, index) => {
    this.errores[index] = ''; // Limpiar mensaje anterior

    if (!pago.payType || pago.payType.trim() === '') {
      this.errores[index] = 'Seleccione un tipo de pago.';
      hayError = true;
    } else if (pago.monto <= 0 || isNaN(pago.monto)) {
      this.errores[index] = 'Ingrese un monto válido.';
      hayError = true;
    }
  });

  if (hayError) {
    return; // Si hay error no envía
  }

  const payload = this.pagos; // envías el array completo de pagos

  this.pagoService.registrarPago(payload).subscribe({
    next: (response: string) => { // El response es un string directo
      alert(response); // muestra el mensaje tal cual viene del backend
      this.dialogRef.close('success'); // cierra el modal
    },
    error: (error) => {
      // En caso de error también podría venir como string
      const msg = error.error || 'Error al registrar el pago';
      alert(msg);
    }
  });
}




  cancelar() {
    this.dialogRef.close();
  }

}

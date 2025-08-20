import { Component, Inject } from '@angular/core';
import { InfoSale } from '../../../../../shared/models/Info-sale';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PagoService } from '../../../../service/pago.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';

@Component({
  selector: 'app-tipo-pago',
  imports: [CommonModule, FormsModule,PayTypeTranslatePipe],
  templateUrl: './tipo-pago.component.html',
  styleUrl: './tipo-pago.component.css'
})
export class TipoPagoComponent {
  infoPago: InfoSale;
  errores: string[] = [];
  tipoPago = [
    { value: 'Yape', label: 'Yape' },
    { value: 'Plim', label: 'Plim' },
    { value: 'Cash', label: 'Efectivo' },
    { value: 'Card', label: 'Tarjeta' },
    { value: 'Debito', label: 'Debito' },
    { value: 'Otros', label: 'Otros' }
  ];

  constructor(
    public dialogRef: MatDialogRef<TipoPagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nroTicket: number, codToday: string, id: number },
    private pagoService: PagoService,
  ) {
    // Inicializa infoPago en el constructor
    this.infoPago = {
      nroTicket: this.data.nroTicket,
      codToday: this.data.codToday,
      idDetails: this.data.id,
      payType: ''
    };
  }

  registroPago() {
    this.errores = [];
    
    if (!this.infoPago.payType || this.infoPago.payType.trim() === '') {
      this.errores[0] = 'Seleccionar un tipo de Pago.';
      return;
    }

    this.pagoService.registerTipoPago(this.infoPago).subscribe({
      next: (response: string) => {
        alert(response);
        this.dialogRef.close('success');
      },
      error: (error) => {
        const msg = error.error || 'Error al registrar pago';
        alert(msg);
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
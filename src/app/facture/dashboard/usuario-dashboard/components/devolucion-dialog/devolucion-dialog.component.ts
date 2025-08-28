import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { environment } from '../../../../../../environments/environmen';


@Component({
  selector: 'app-devolucion-dialog',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,PayTypeTranslatePipe],
  templateUrl: './devolucion-dialog.component.html',
  styleUrl: './devolucion-dialog.component.css'
})
export class DevolucionDialogComponent {

  @Input() idProducto!: number;
  @Input() monto!: number;
  @Output() onClose = new EventEmitter<boolean>();

  payTypes = ['Debito','Card','Cash', 'Plim','Yape'];
  selectedPayType = 'Debito';
  mensaje = '';
  loading = false;

  constructor(private http: HttpClient){}

  enviarDevolucion(){
    this.loading = true;
    const body = {
      idProducto: this.idProducto,
      monto: this.monto,
      payType: this.selectedPayType
    };
    this.http.post(`${environment.apiUrl}/devoluciones/eliminarDetail`,body,{responseType: 'text'})
    .subscribe({
      next: (resp: string) => {
        this.mensaje = resp;
        setTimeout(() => {
          this.onClose.emit(true);
        },3000);
      },
      error: (err) => {
        this.mensaje = err.error;
        this.loading = false;
      }
    });
  }
  cerrar(){
    this.onClose.emit(false)
  }

}

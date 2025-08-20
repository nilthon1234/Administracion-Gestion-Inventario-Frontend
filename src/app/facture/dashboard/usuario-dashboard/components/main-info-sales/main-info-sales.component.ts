import { Component, OnInit } from '@angular/core';
import { InfoSale } from '../../../../../shared/models/Info-sale';
import { PagoService } from '../../../../service/pago.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { PayTypeNavbarComponent } from "../../../../../shared/components/navbars/pay-type-navbar/pay-type-navbar.component";
import { EspecificacionesPipe } from '../../../../../shared/pipes/especificaciones.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-main-info-sales',
  imports: [CommonModule,CopiarTextoDirective, FormsModule, EspecificacionesPipe,CustomDateFormatPipe, PayTypeTranslatePipe, PayTypeNavbarComponent],
  templateUrl: './main-info-sales.component.html',
  styleUrl: './main-info-sales.component.css'
})
export class MainInfoSalesComponent implements OnInit{

   payTypeOptions = [
    { value: '', display: 'Seleccione' },
    { value: 'Cash', display: 'Efectivo' },
    { value: 'Yape', display: 'Yape' },
    { value: 'Plim', display: 'Plim' },
    { value: 'Debito', display: 'Débito' },
    { value: 'Card', display: 'Tarjeta' }
  ];
infoSales: InfoSale[] =[];
isSaveDisabled: boolean = true;

  showModal: boolean = false;
  currentSale: InfoSale | null = null;
  paymentMethods: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private pagosService: PagoService,){}

  ngOnInit(): void {
    this.listaInfosales();

  }
  listaInfosales(){
    this.pagosService.allListOrderFilterPago().subscribe({
      next: (data: InfoSale[]) => {
        this.infoSales = data;
      },
      error:(err) => {
        console.error('Error al obtener Datos:', err);
      }
    });
  }

  openPaymentModal(sale: InfoSale): void {
    this.currentSale = sale;
    this.paymentMethods = [{ ticket: sale.nroTicket, payType: '', monto: '' }];
    this.errorMessage = '';
    this.successMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  addPaymentMethod(): void {
    this.paymentMethods.push({ ticket: this.currentSale?.nroTicket || '', payType: '', monto: '' });
    this.checkPaymentMethods();
  }

  removePaymentMethod(index: number): void {
    if (this.paymentMethods.length > 1) {
      this.paymentMethods.splice(index, 1);
    }
  }
  checkPaymentMethods(): void {
    this.isSaveDisabled = this.paymentMethods.some(method => !method.payType);
  }

  submitPaymentMethods(): void {
  if (!this.currentSale) return;

  this.errorMessage = '';
  this.successMessage = '';

  const payload = {
    infoSalesId: this.currentSale.id,
    metodosPago: this.paymentMethods.map(method => ({
      ticket: Number(method.ticket),
      payType: method.payType,
      monto: Number(method.monto)
    }))
  };

  this.pagosService.specifyPaymentMethods(payload).subscribe({
    next: (response: any) => {
      this.successMessage = response.message || 'Métodos de pago registrados correctamente';
      setTimeout(() => {
        this.closeModal();
        this.listaInfosales();
      }, 1500);
    },
    error: (err: any) => {
      this.errorMessage = err.message || 'Error al registrar métodos de pago';
      
      // Manejo específico de errores conocidos
      if (err.message.includes('no coincide con el monto base')) {
        this.errorMessage = err.message;
      } else if (err.message.includes('no corresponde a esta venta')) {
        this.errorMessage = err.message;
      } else if (err.message.includes("La especificación debe ser 'NoEspecificado'")) {
        this.errorMessage = 'El registro debe estar marcado como "NOESPECIFICADO" para poder modificarlo';
      }
    }
  });
}

}

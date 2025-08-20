import { Component, Input } from '@angular/core';
import { AmortizationService } from '../../../../service/amortization.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaleDataService } from '../../../../service/sale-data.service';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';

@Component({
  selector: 'app-register-amortization',
  standalone: true,
  imports: [FormsModule, CommonModule,PayTypeTranslatePipe],
  templateUrl: './register-amortization.component.html',
  styleUrl: './register-amortization.component.css'
})
export class RegisterAmortizationComponent {

  closeModal() {
    this.responseData = null;
  }

  clientData: any;

  // Lista de métodos de pago con etiqueta y valor real
  payTypes = [
    { label: 'Efectivo', value: 'Cash' },
    { label: 'Tarjeta', value: 'Card' },
    { label: 'Debito', value: 'Debito' },
    { label: 'Plim', value: 'Plim' },
    { label: 'Yape', value: 'Yape' }
  ];

  amortizationData = {
    account: 0,
    payType: 'Cash'
  };

  responseData: any;
  loading = false;

  constructor(
    private amortizationService: AmortizationService,
    private router: Router,
    private separationDataService: SaleDataService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && 'clientData' in navigation.extras.state) {
      this.clientData = (navigation.extras.state as { clientData: any }).clientData;
    }
  }

  onSubmit() {
    this.loading = true;
    const data = {
      idClient: this.clientData.id,
      dni: this.clientData.dni,
      account: this.amortizationData.account,
      payType: this.amortizationData.payType // Valor real enviado al backend
    };

    this.amortizationService.registerAmortization(data).subscribe(
      response => {
        this.responseData = response;
        this.loading = false;
      },
      error => {
        console.error('Error en registro de amortización:', error);
        alert(`Error: ${error.status} - ${error.error?.message || error.message || 'Error desconocido'}`);
        this.loading = false;
      }
    );
  }

  goToMain() {
    this.router.navigate(['/main-client-separation-amortization']);
  }

  registerAsSale() {
  this.separationDataService.setClientData(this.clientData);
  this.router.navigate(['/register-venta-separada']);
}

  formatSize(size: string): string {
    if (!size) return '';
    return size.replace('_', '.').replace('usa', '').replace('eu', '');
  }

  shouldShowSize(type: string): boolean {
    return ['ZAPATILLA', 'SANDALIA','BOTINES'].includes(type.toUpperCase());
  }

  isSizeColumn(): boolean {
    // Check if any separation has a type that requires showing size
    return this.clientData?.separations?.some((sep: any) => 
      ['ZAPATILLA', 'SANDALIA', 'BOTINES'].includes(sep.type.toUpperCase())
    );
  }
}
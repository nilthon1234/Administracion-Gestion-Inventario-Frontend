import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SaleDataService } from '../../../../service/sale-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Separation {
  repositoryType: string;
  codToday: string;
  type: string;
  genero: string;
  idClient?: string;
  id?: string;
  size?: string;
  amount?: number;
  price: number;
}

@Component({
  selector: 'app-register-venta-separada',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-venta-separada.component.html',
  styleUrls: ['./register-venta-separada.component.css']
})
export class RegisterVentaSeparadaComponent {

  errorMessage: string = '';
  showError: boolean = false;

  clientData: any;
  separationsWithSize: Separation[] = [];
  separationsWithAmount: Separation[] = [];

  ticketType: string = 'SeparacionCompletadaYRegistrado';
  repositoryOptions = ['VITRINA', 'ALMACEN'];
  //repositoryOptions = ['VITRINA', 'VITRINAB', 'ALMACEN'];


  sellerName: string = '';

  payMethods = [
    { label: 'Plim', value: 'Plim' },
    { label: 'Yape', value: 'Yape' },
    { label: 'Efectivo', value: 'Cash' },
    { label: 'Tarjeta', value: 'Card' },
    { label: 'Debito', value: 'Debito' },
  ];
  payType: string = 'Cash'; // valor inicial


  constructor(private separationDataService: SaleDataService, private http: HttpClient,
    private router: Router,
  ) {
    this.clientData = this.separationDataService.getClientData();

    if (this.clientData?.separations) {
      this.separationsWithSize = this.clientData.separations.filter((s: Separation) =>
        ['BOTINES','ZAPATILLA', 'SANDALIA'].includes(s.type?.toUpperCase())
      );
      this.separationsWithAmount = this.clientData.separations.filter((s: Separation) =>
        ['CANGURO', 'GORRA', 'MEDIAS'].includes(s.type?.toUpperCase())
      );
    }
  }

  formatSize(size: string): string {
    if (!size) return '';
    return size.replace(/^(usa|eu)/, '').replace('_', '.');
  }

  registerSale() {
    if (!this.clientData) return;

    // Construir detalles para productos con cantidad
    const detailsWithAmount = this.separationsWithAmount.map(s => ({
      repositoryType: s.repositoryType,
      type: s.type,
      ticketType: this.ticketType,
      payType: this.payType,
      codToday: s.codToday,
      amount: s.amount,
      price: s.price,
      idSeparacion: s.id,
      idClient: s.idClient,
    }));

    // Construir detalles para productos con talla (usar array de tallas)
    const detailsWithSize = this.separationsWithSize.map(s => ({
      repositoryType: s.repositoryType,
      type: s.type,
      ticketType: this.ticketType,
      payType: this.payType,
      codToday: s.codToday,
      sizes: [parseFloat(this.formatSize(s.size!))], // convertir a número
      price: s.price,
      idSeparacion: s.id,
      idClient: s.idClient,
    }));

    // Unir todos los detalles
    const details = [...detailsWithAmount, ...detailsWithSize];

    // Construir el objeto completo
    const payload = {
      ticket: {
        sellerName: this.sellerName,
        clientName: this.clientData.name,
        clientLastName: this.clientData.lastName,
        dni: this.clientData.dni.toString()
      },
      details: details
    };

    // Resetear mensajes de error
    this.showError = false;
    this.errorMessage = '';

    // Enviar POST al backend
    this.http.post('http://localhost:80/sale/registerSale', payload).subscribe({
      next: (res) => {
        alert('Venta registrada correctamente');
        this.router.navigate(['/main-venta']);
      },
       error: (err) => {
        this.showError = true;
        
        // Manejo mejorado de errores
        if (err.error && typeof err.error === 'object') {
          // Error con estructura {error: "mensaje"}
          if (err.error.error) {
            this.errorMessage = err.error.error;
          } 
          // Error con estructura {message: "mensaje"}
          else if (err.error.message) {
            this.errorMessage = err.error.message;
          }
          // Otro tipo de error en formato JSON
          else {
            this.errorMessage = 'Error al procesar la solicitud';
          }
        } 
        // Error de conexión u otros
        else {
          this.errorMessage = err.message || 'Error desconocido al registrar la venta';
        }
        
        console.error('Error completo:', err);
      }
    });
  }
}

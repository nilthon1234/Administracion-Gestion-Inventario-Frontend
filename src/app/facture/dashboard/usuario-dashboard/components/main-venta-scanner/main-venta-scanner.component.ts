import { Component, OnInit } from '@angular/core';
import { NavbarVentasComponent } from '../../../../../shared/components/navbars/navbar-ventas/navbar-ventas.component';
import { RegisterScannerWebsocketService } from '../../../../service/register-scanner-websocket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { SaleDataService } from '../../../../service/sale-data.service';
import { ApiResponse, Sale, SaleDetail } from '../../../../../shared/models/sale';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';

@Component({
  selector: 'app-main-venta-scanner',
  standalone: true,
  imports: [NavbarVentasComponent, FormsModule, CommonModule, SizeFormatPipe, PayTypeTranslatePipe],
  templateUrl: './main-venta-scanner.component.html',
  styleUrls: ['./main-venta-scanner.component.css']
})
export class MainVentaScannerComponent implements OnInit {
  lista: any[] = [];
  mensaje: string = '';
  error: boolean = false;

  dni: string = '';
  payType: string = 'Cash';
  payTypeLocked = false;
  total: number = 0;
  contadorSeleccionado: string = 'ACTIVADO';
  colors = ['#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFF9C4', '#D1C4E9'];
  payTypes = ['Cash', 'Card', 'Yape', 'Plim', 'Otros', 'Debito'];
  cashGiven: number = 0;
  change: number = 0;

  constructor(
    private wsService: RegisterScannerWebsocketService,
  ) { }

  ngOnInit() {
    const maquina = 'MAQ02';
    this.wsService.connect(maquina);
    this.wsService.lista$.subscribe(data => {
      this.lista = data;
      this.lista.forEach(item => {
        item.ubicacion = item.ubicacion || 'ALMACEN';
        item.size = Array.isArray(item.sizes)
          ? item.sizes
          : (typeof item.sizes === 'string' ? item.sizes.split(',').map((s: string) => s.trim()) : []);
        item.payType = item.payType || this.payType;
        item.price = item.price || 0;
        item.subtotal = item.amount * item.price;
      });
      this.updateTotal();
    });
  }

  updateSubtotal(item: any): void {
    item.subtotal = item.amount * item.price;
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.lista.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    this.calculateChange();
  }

  calculateChange() {
    if (!this.cashGiven) {
      this.change = 0.00;
    } else {
      this.change = this.cashGiven - this.total;
      if (this.change < 0) {
        this.change = 0.00;
      }
    }
  }


  esFormularioValido(): boolean {
    if (!this.dni || this.dni.trim().length < 6) return false;
    return this.lista.every(item =>
      item.codToday &&
      item.amount && item.amount > 0 &&
      item.price && item.price > 0
    );
  }

  transformarTallasString(sizes: any): string[] {
    return Array.isArray(sizes) ? sizes.map((s: string) => s.trim()) : [];
  }


  registrarVenta(): void {
    const detalles: SaleDetail[] = this.lista.map(item => {
      const detalle: SaleDetail = {
        codToday: item.codToday,
        amount: item.amount,
        price: item.price,
        repositoryType: item.repositoryType,
        type: item.type,
        ticketType: 'Registrado',
        payType: item.payType,
        gender: item.genero
      };
      if (item.producto !== 'UNICO') {
        if (Array.isArray(item.size) && item.size.length > 0) {
          detalle.sizes = item.size.map((s: string) => s.trim());  // Usa las tallas como string
        }

      }
      return detalle;
    });

    const venta: Sale = {
      ticket: {
        dni: this.dni,
        equipo: 'MAQ02',
        contador: this.contadorSeleccionado
      },
      details: detalles
    };

    this.wsService.registerSale(venta).subscribe(
      (resp: ApiResponse) => {
        if (resp.message) {
          this.limpiarDni();
          this.mensaje = resp.message;
          this.error = false;
        } else if (resp.error) {
          this.mensaje = resp.error;
          this.error = true;
        } else {
          this.mensaje = 'Error desconocido.';
          this.error = true;
        }
        setTimeout(() => {
          this.mensaje = '';
        }, 3000);
      },
      (err) => {
        this.mensaje = 'Ocurrió un error al conectar con el servidor.';
        this.error = true;
        setTimeout(() => {
          this.mensaje = '';
        }, 4500);
      }
    );
  }

  toggleContador() {
    this.contadorSeleccionado = this.contadorSeleccionado === 'ACTIVADO' ? 'ANULADO' : 'ACTIVADO';
  }

  checkOtros(changedItem: any) {
  if (changedItem.payType === 'Otros') {
    // Poner todos en Otros
    this.lista.forEach(item => item.payType = 'Otros');

    // Bloquear edición en todos excepto el que cambió
    this.payTypeLocked = true;
    this.lista.forEach(item => item.isEditable = (item === changedItem));

  } else {
    // Si alguno está en Otros significa que cambiaron el Others a cualquier otro tipo
    const anyOtros = this.lista.some(item => item.payType === 'Otros');

    if (anyOtros) {
      // Cambiar todos los Otros a el payType del item cambiado (quitar rastro de "Otros")
      this.lista.forEach(item => {
        if(item.payType === 'Otros') {
          item.payType = changedItem.payType;
        }
      });

      // Desbloquear todos
      this.lista.forEach(item => item.isEditable = true);
      this.payTypeLocked = false;

    } else {
      // No hay Otros en ningún lado, desbloquear todo
      this.payTypeLocked = false;
      this.lista.forEach(item => item.isEditable = true);
    }
  }
}



  eliminarTallaDeRegistro(registroId: number, talla: string) {
    this.wsService.eliminarTalla(registroId, talla);
  }

  eliminarRegistro(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro completo?')) {
      this.wsService.deleteRegisterById(id).subscribe({
        next: (response) => {
        },
        error: (err) => {
          this.mensaje = 'Error al eliminar el registro.';
          this.error = true;
        }
      });
    }
  }

  limpiarDni() {
    this.dni = '';
    this.change = 0;
    this.cashGiven = 0;
  }

}

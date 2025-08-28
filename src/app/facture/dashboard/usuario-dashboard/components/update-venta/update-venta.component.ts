import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleDataService } from '../../../../service/sale-data.service';
import { Gender, SizesByGender } from '../../../../../shared/models/sale';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { SizeComponent } from '../size/size.component';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { TallaDisplayPipe } from '../../../../../shared/pipes/tallasDisplay.pipe';

@Component({
  selector: 'app-update-venta',
  imports: [CommonModule, FormsModule, PayTypeTranslatePipe,TallaDisplayPipe],
  templateUrl: './update-venta.component.html',
  styleUrl: './update-venta.component.css'
})
export class UpdateVentaComponent implements OnInit {

  nroTicket: number = 0;
  codToday: string = '';
  size: string | null = null;
  price: number = 0;
  company: string = '';
  type: string = '';
  producto: string = '';
  genero: string = '';
  payType: string = '';
  amount: number = 0;
  // En UpdateVentaComponent
tiposProducto: string[] = ['CALZADO', 'ROPA', 'UNICO'];
  readonly CALZADO_TYPES = ['CALZADO'];
  readonly ROPA_TYPES = ['ROPA'];
  readonly ACCESORIOS_TYPES = ['UNICO'];
  readonly TALLAS_ROPA = ['XS', 'S', 'M', 'L', 'XL'];
  generos: Gender[] = [];
  selectedGenero: string = '';
  tallasPorGenero: SizesByGender = {
    hombre: [],
    mujer: [],
    niño: [],
    niña: [],
    bebé: []
  };
  tallasDisponibles: (number | string)[] = [];
  showGenero = false;
  showTallas = false;

  detail: any = {
    type: '',
    codToday: '',
    price: 0,
    sizes: [],
    amount: 1,
    payType: 'Cash',
    repositoryType: 'ALMACEN'
  };

  // Agrega estas propiedades a tu clase
  repositoryTypes = [
    { value: 'ALMACEN', display: 'ALMACEN' },
    { value: 'VITRINA', display: 'VITRINA' },
   // { value: 'VITRINAB', display: 'VITRINAB' }
  ];

  paymentTypes = [
    { value: 'Cash', display: 'Efectivo' },
    { value: 'Card', display: 'Tarjeta' },
    { value: 'Debito', display: 'Debito' },
    { value: 'Yape', display: 'Yape' },
    { value: 'Plim', display: 'Plim' },
    { value: 'Otros', display: 'Otros' }
  ];

  constructor(
    private router: ActivatedRoute,
    private salesService: SaleDataService,
    private routerLink: Router,
  ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.nroTicket = params['nroTicket'];
      this.codToday = params['codToday'];
      this.price = +params['price'];
      this.company = params['company'];
      this.type = params['type'];
      this.producto = params['producto'];
      this.genero = params['genero'];
      this.payType = params['payType'];
      this.amount = params['amount'];
      this.size = params['size'] || null;
      // Inicializar con valores actuales
      this.detail = {
        ...this.detail,
        codToday: this.codToday,
        price: this.price,
        type: params['type'] || '',
        producto: params['producto'] || '',
        repositoryType: params['repositoryType'] || 'ALMACEN', // Valor por defecto
        payType: params['payType'] || 'Cash' // Valor por defecto
      };

      this.selectedGenero = this.genero || '';

      // Configurar tipo si viene en params
      if (params['producto']) {
        this.onTypeChange();
      }
    });

    this.cargarDatos();
  }
  

  isTipoDisabled(tipo: string): boolean {
  // Si no hay tipo seleccionado, no deshabilitar nada
  if (!this.detail.type) return false;
  
  // Determinar la categoría del tipo actual seleccionado
  const currentCategory = 
    this.CALZADO_TYPES.includes(this.detail.producto) ? 'CALZADO' :
    this.ROPA_TYPES.includes(this.detail.producto) ? 'ROPA' :
    'ACCESORIOS';
  
  // Determinar la categoría del tipo que estamos evaluando
  const targetCategory = 
    this.CALZADO_TYPES.includes(tipo) ? 'CALZADO' :
    this.ROPA_TYPES.includes(tipo) ? 'ROPA' :
    'ACCESORIOS';
  
  // Deshabilitar todos los tipos que no sean de la misma categoría
  return currentCategory !== targetCategory;
}

  cargarDatos() {
    this.salesService.getGenero().subscribe(data => {
      this.generos = data;
    });

    this.salesService.getTalla().subscribe(data => {
      this.tallasPorGenero = data;

      // Aquí llamamos a onGeneroChange() después de cargar tallas
      if (this.selectedGenero) {
        this.onGeneroChange();
      }
    });
  }

  onTypeChange() {
  const isCalzado = this.CALZADO_TYPES.includes(this.detail.producto);
  const isRopa = this.ROPA_TYPES.includes(this.detail.producto);
  const isAccesorio = this.ACCESORIOS_TYPES.includes(this.detail.producto);
  
  // Mostrar género solo para calzado y ropa
  this.showGenero = isCalzado || isRopa;
  
  // Mostrar tallas solo para calzado y ropa
  this.showTallas = this.showGenero;

  // Resetear valores cuando no aplican
  if (!this.showGenero) {
    this.detail.sizes = [];
    this.selectedGenero = '';
  }

  // Manejar cantidad
  if (this.showTallas) {
    this.detail.amount = null; // Deshabilitar cantidad para productos con tallas
  } else {
    this.detail.amount = this.detail.amount || 1; // Habilitar cantidad para accesorios
  }
  
  // Actualizar tallas disponibles si es necesario
  if (this.showGenero && this.selectedGenero) {
    this.onGeneroChange();
  }
}

  onGeneroChange() {
    const isRopa = this.ROPA_TYPES.includes(this.detail.producto);

    if (isRopa) {
      // Para ropa, usar las tallas predefinidas como strings
      this.tallasDisponibles = this.TALLAS_ROPA;
      this.detail.sizes = [this.TALLAS_ROPA[0]];
    } else {
      // Lógica original para calzado
      const generoKey = this.selectedGenero.toLowerCase();

      if (this.tallasPorGenero.hasOwnProperty(generoKey)) {
        const generoTallas = this.tallasPorGenero[generoKey as keyof SizesByGender];
        this.tallasDisponibles = generoTallas.map(t => parseFloat(t.talla));

        if (this.tallasDisponibles.length > 0) {
          this.detail.sizes = [this.tallasDisponibles[0]];
        } else {
          this.detail.sizes = [];
        }
      } else {
        this.tallasDisponibles = [];
        this.detail.sizes = [];
      }
    }
  }
  getGenerosFiltrados(): Gender[] {
    return this.ROPA_TYPES.includes(this.detail.producto)
      ? this.generos.filter(g => g.nombre === 'Hombre' || g.nombre === 'Mujer')
      : this.generos;
  }

  isFormValid(): boolean {
    if (!this.detail.type || !this.detail.codToday || !this.detail.price) {
      return false;
    }

    const isRopa = this.ROPA_TYPES.includes(this.detail.producto);
    const isCalzado = ['CALZADO'].includes(this.detail.producto);

    if ((isCalzado || isRopa) && this.detail.sizes.length === 0) {
      return false;
    }

    if (!isCalzado && !isRopa && (!this.detail.amount || this.detail.amount < 1)) {
      return false;
    }

    return true;
  }

  actualizarDetalle() {
    if (!this.isFormValid()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const payload = {
      nroTicket: this.nroTicket,
      codToday: this.codToday,
      size: this.size,
      detail: {
        ...this.detail,
        sizes: this.detail.sizes.map((s: any) => {
          if (typeof s === 'string') {
            return s.toLowerCase(); // "XL" → "xl"
          }
          return s; // 31.0 → 31.0
        })
      }
    };

    this.salesService.updateSlipperSales(payload).subscribe({
      next: (mensaje: string) => {
        // Display the message from the backend in the alert
        alert(mensaje || 'Venta actualizada correctamente');
        this.routerLink.navigate(['/main-venta']);
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        // Display the error message from the backend if available
        const errorMessage = error.error || 'Error al actualizar la venta. Verifique los datos e intente nuevamente.';
        alert(errorMessage);
      }
    });
  }


}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { NavbarVentasComponent } from "../../../../../shared/components/navbars/navbar-ventas/navbar-ventas.component";
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { RegisterScannerWebsocketService } from '../../../../service/register-scanner-websocket.service';
import { MensajeService } from '../../../../service/mensaje.service';
import { RepositoryTypeColorPipe } from '../../../../../shared/pipes/repositoryTypeColor.pipe';

interface Slipper {
  id: number;
  brand: string;
  codToday: string;
  amount: number;
  image: string;
  company: string;
  type: string;
  producto: string;
  repositoryType?: string;
  registrationDate: string;
  urlImg: string;
  sizes: { [key: string]: number };
  genero: string;
  price: string;
  nuevaCantidad?: number;
  editandoCantidad?: boolean;
}

interface CartItem {
  product: Slipper;
  selectedSizes: string[];
  quantity: number; // Para productos sin talla
  subtotal: number;
  payType: string;
  isOtherDisabled?: boolean;


}

@Component({
  selector: 'app-register-venta2',
  imports: [CommonModule, FormsModule, NavbarVentasComponent, SizeFormatPipe, RepositoryTypeColorPipe],
  templateUrl: './register-venta2.component.html',
  styleUrls: ['./register-venta2.component.css']  // <-- Corrección aquí
})

export class RegisterVenta2Component implements OnInit {

  searchTerm: string = '';
  searchType: 'codToday' | 'company' = 'codToday';
  searchResults: Slipper[] = [];
  showResults: boolean = false;

  cart: CartItem[] = [];
  selectedProduct: Slipper | null = null;
  selectedSizes: string[] = [];
  productQuantity: number = 1;

  total: number = 0;
  cashReceived: number = 0;
  change: number = 0;

  private searchSubject = new Subject<string>();

  // Tipos que requieren selección de talla
  sizeTypes = ['CALZADO', 'ROPA'];
  // Tipos que usan tallas de ropa (XS, S, M, L, XL)
  clothingSizeTypes = ['ROPA'];
  // Tipos que usan tallas de calzado (números)
  shoeSizeTypes = ['CALZADO'];
  // Tipos que no requieren talla
  noSizeTypes = ['UNICO'];

  constructor(private filterService: FilterSlipperService,
    private wsService: RegisterScannerWebsocketService,
    private mensajeService: MensajeService
  ) { }

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.trim() === '') {
          this.searchResults = [];
          this.showResults = false;
          return [];
        }
        return this.searchType === 'codToday'
          ? this.filterService.buscarPorCodTodayOCompany2(term)
          : this.filterService.buscarPorCodTodayOCompany2(undefined, term);
      })
    ).subscribe({
      next: (results: Slipper[]) => {
        this.searchResults = results || []
        this.showResults = this.searchResults.length > 0;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.searchResults = [];
        this.showResults = false;
      }
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchTerm);
  }

  searchManually() {
    if (this.searchTerm.trim() === '') {
      this.searchResults = [];
      this.showResults = false;
      return;
    }

    const searchObservable = this.searchType === 'codToday'
      ? this.filterService.buscarPorCodTodayOCompany2(this.searchTerm)
      : this.filterService.buscarPorCodTodayOCompany2(undefined, this.searchTerm);

    searchObservable.subscribe({
      next: (results: Slipper[]) => {
        this.searchResults = results || [];
        this.showResults = this.searchResults.length > 0;

        if (this.searchResults.length === 0) {
          alert('No se encontraron productos');
        }
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.searchResults = [];
        this.showResults = false;
        alert('Error al buscar productos: ' + error.message);
      }
    });
  }


  selectProduct(product: Slipper) {
    console.log('Producto seleccionado:', product); // Debug
    this.selectedProduct = { ...product }; // Hacer una copia
    this.selectedSizes = [];
    this.productQuantity = 1;
    this.showResults = false;
    this.searchTerm = '';
  }

  getAvailableSizes(product: Slipper): { key: string, value: number }[] {
    if (!product || !product.sizes) {
      console.log('No hay sizes disponibles para:', product); // Debug
      return [];
    }

    console.log('Sizes del producto:', product.sizes); // Debug

    const availableSizes: { key: string, value: number }[] = [];

    for (const [key, value] of Object.entries(product.sizes)) {
      const numValue = typeof value === 'string' ? parseInt(value) : value;
      if (this.shouldIncludeSize(product.producto, key) && numValue > 0) {
        availableSizes.push({ key, value: numValue });
      }
    }

    console.log('Tallas disponibles filtradas:', availableSizes); // Debug
    return availableSizes;
  }

  private shouldIncludeSize(productType: string, sizeKey: string): boolean {
    if (this.clothingSizeTypes.includes(productType)) {
      // Para ropa, solo incluir XS, S, M, L, XL
      return ['xs', 's', 'm', 'l', 'xl'].includes(sizeKey.toLowerCase());
    } else if (this.shoeSizeTypes.includes(productType)) {
      // Para calzado, incluir tallas numéricas (excluir XS, S, M, L, XL)
      return !['xs', 's', 'm', 'l', 'xl'].includes(sizeKey.toLowerCase());
    }
    return false;
  }

  addSizeToSelection(sizeKey: string) {
    if (this.selectedProduct && this.sizeTypes.includes(this.selectedProduct.producto)) {
      this.selectedSizes.push(sizeKey);
    }
  }

  removeSizeFromSelection(index: number) {
    this.selectedSizes.splice(index, 1);
  }

  addToCart() {
    if (!this.selectedProduct) return;

    const isNoSizeProduct = this.noSizeTypes.includes(this.selectedProduct.producto);
    const isSizeProduct = this.sizeTypes.includes(this.selectedProduct.producto);

    if (isSizeProduct && this.selectedSizes.length === 0) {
      alert('Debe seleccionar al menos una talla');
      return;
    }

    if (isNoSizeProduct && this.productQuantity <= 0) {
      alert('Debe especificar una cantidad válida');
      return;
    }

    let quantity = 0;
    if (isNoSizeProduct) {
      quantity = this.productQuantity;
    } else {
      quantity = this.selectedSizes.length;
    }

    const productPrice = parseFloat(this.selectedProduct.price) || 0;
    const subtotal = productPrice * quantity;

    const cartItem: CartItem = {
      product: { ...this.selectedProduct },
      selectedSizes: [...this.selectedSizes],
      quantity: isNoSizeProduct ? this.productQuantity : 0,
      subtotal: subtotal,
      payType: this.selectedPayType
    };

    this.cart.push(cartItem);
    this.calculateTotal();
    this.resetSelection();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateTotal();
  }

  removeSizeFromCart(cartIndex: number, sizeIndex: number) {
    const cartItem = this.cart[cartIndex];
    cartItem.selectedSizes.splice(sizeIndex, 1);

    if (cartItem.selectedSizes.length === 0) {
      this.removeFromCart(cartIndex);
    } else {
      const productPrice = this.getPrice(cartItem.product.price);
      cartItem.subtotal = productPrice * cartItem.selectedSizes.length;
      this.calculateTotal();
    }
  }

  updateQuantity(cartIndex: number, newQuantity: number) {
    const cartItem = this.cart[cartIndex];
    if (this.noSizeTypes.includes(cartItem.product.producto)) {
      if (newQuantity <= 0) {
        alert('La cantidad debe ser mayor a 0');
        return;
      }

      cartItem.quantity = newQuantity;
      const productPrice = this.getPrice(cartItem.product.price);
      cartItem.subtotal = productPrice * newQuantity;
      this.calculateTotal();
    }
  }

  private calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.subtotal, 0);
    this.calculateChange();
  }

  calculateChange() {
    this.change = this.cashReceived - this.total;
  }

  private resetSelection() {
    this.selectedProduct = null;
    this.selectedSizes = [];
    this.productQuantity = 1;
  }

  onSearchTypeChange() {
    this.searchTerm = '';
    this.showResults = false;
    this.searchResults = [];
  }

  isNoSizeProduct(type: string): boolean {
    return this.noSizeTypes.includes(type);
  }

  isSizeProduct(type: string): boolean {
    return this.sizeTypes.includes(type);
  }

  getPrice(priceString: string): number {
    return parseFloat(priceString) || 0;
  }
  //Tipos de pago
  payTypes: { value: string, label: string }[] = [
    { value: 'Cash', label: 'Efectivo' },
    { value: 'Card', label: 'Tarjeta' },
    { value: 'Plim', label: 'Plim' },
    { value: 'Yape', label: 'Yape' },
    { value: 'Debito', label: 'Debito' },
    { value: 'Otros', label: 'Otros' }
  ];

  selectedPayType: string = 'Cash';
  editableIndex: number | null = null;
  isPayTypeEditable(index: number): boolean {
    return !this.cart.some(item => item.payType === 'Otros') ||
      this.editableIndex === index;
  }

  onPayTypeChange(index: number, newType: string) {
    const previousType = this.cart[index].payType;

    // Caso 1: Cambiando a 'Otros'
    if (newType === 'Otros') {
      this.editableIndex = index;
      this.cart.forEach((item, i) => {
        item.payType = 'Otros';
        item.isOtherDisabled = false;
      });
      return;
    }

    if (previousType === 'Otros') {
      this.cart[index].payType = newType;
      this.editableIndex = null;

      this.cart.forEach((item, i) => {
        item.isOtherDisabled = false;

        if (i !== index && item.payType === 'Otros') {
          item.payType = newType;
        }
      });
      return;
    }

    this.cart[index].payType = newType;
  }

  isOptionDisabled(item: any, optionValue: string): boolean {
    // Deshabilitar la opción 'Otros' si está marcado como isOtherDisabled
    if (optionValue === 'Otros' && item.isOtherDisabled) return true;

    return false;
  }
  //Contador

  contadorSeleccionado: string = 'ACTIVADO';
  toggleContador() {
    this.contadorSeleccionado = this.contadorSeleccionado === 'ACTIVADO' ? 'ANULADO' : 'ACTIVADO';
  }
  //Registrar venta

  registrarVenta2(): void {
    const detalles: any[] = this.cart.map(item => {
      const detalle: any = {
        codToday: item.product.codToday,
        amount: item.selectedSizes.length > 0 ? item.selectedSizes.length : item.quantity,
        price: parseFloat(item.product.price),
        repositoryType: item.product.repositoryType,
        type: item.product.type,
        ticketType: 'Registrado',
        payType: item.payType,
        gender: item.product.genero
      };
      if (this.isSizeProduct(item.product.producto)) {
        detalle.sizes = item.selectedSizes.map(size => size.trim());
      }
      return detalle;
    });

    const dniInput = document.querySelector('.dni-input') as HTMLInputElement;
    const dniValue = dniInput?.value?.trim() || '';

    if (!dniValue) {
      this.mensajeService.showError('Por favor, ingrese el DNI antes de registrar la venta.');
      return;
    }

    const venta: any = {
      ticket: {
        dni: dniValue,
        equipo: 'MAQ02',
        contador: this.contadorSeleccionado
      },
      details: detalles
    };

    this.wsService.registerSale(venta).subscribe({
      next: (resp: any) => {
        if (resp.message) {
          this.mensajeService.showSuccess('Venta registrada correctamente');
          this.cart = [];
          this.total = 0;
          this.cashReceived = 0;
          this.change = 0;
          dniInput.value = '';
        } else if (resp.error) {
          this.mensajeService.showError('Error: ' + resp.error);
        } else {
          this.mensajeService.showError('Error desconocido al registrar la venta.');
        }
      },
      error: (err) => {
        console.error(err);
        this.mensajeService.showError('Error al conectar con el servidor.');
      }
    });
  }
  //Update price


  // Método updatePrice mejorado para recalcular subtotales y total automáticamente
  updatePriceInput(cartItem: any, event: Event) {
    const target = event.target as HTMLInputElement;
    const newPrice = parseFloat(target.value);
    
    if (!isNaN(newPrice) && newPrice >= 0) {
      cartItem.product.price = newPrice.toString();
      this.recalculateItemSubtotal(cartItem);
      this.calculateTotal();
    }
  }

  // Método auxiliar para recalcular subtotal de un item específico
  private recalculateItemSubtotal(cartItem: any) {
    const price = this.getPrice(cartItem.product.price);

    if (this.isSizeProduct(cartItem.product.producto)) {
      cartItem.subtotal = cartItem.selectedSizes.length * price;
    } else if (this.isNoSizeProduct(cartItem.product.producto)) {
      cartItem.subtotal = cartItem.quantity * price;
    }
  }

  // Validar precio al perder el foco (para input numérico)
  validatePrice(cartItem: any, event: Event) {
    const target = event.target as HTMLInputElement;
    const newPrice = parseFloat(target.value);

    if (isNaN(newPrice) || newPrice < 0) {
      // Restaurar precio anterior si es inválido
      target.value = this.getPrice(cartItem.product.price).toString();
      alert('Por favor ingrese un precio válido mayor o igual a 0');
      return;
    }

    cartItem.product.price = newPrice.toString();
    this.recalculateItemSubtotal(cartItem);
    this.calculateTotal();
  }

}
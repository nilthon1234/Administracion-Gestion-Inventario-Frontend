import { Component, OnInit } from '@angular/core';
import { SaleDataService } from '../../../../service/sale-data.service';
import { SeparationService } from '../../../../service/separation.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { RepositoryTypeColorPipe } from '../../../../../shared/pipes/repositoryTypeColor.pipe';

interface ProductResult {
  entity: any;
  id: number;
  brand: string;
  codToday: string;
  amount: number;
  image: any;
  company: string;
  producto: string;
  price: number;
  registrationDate: string;
  urlImg: string;
  type: string;
  genero: string;
  repositoryType: string;
  sizes: any;
}

interface SelectedSize {
  id: string;
  size: string;
  product: ProductResult;
}

interface SeparatedProduct {
  id: string;
  codToday: string;
  brand: string;
  type: string;
  producto: string;
  genero: string;
  repositoryType: string;
  price: number;
  sizes: string[];
  amount?: number; // Para productos UNICO
  urlImg: string;
  subTotal: number;
}

interface Amortization {
  payType: string;
  amount: number;
}

interface Client {
  name: string;
  lastName: string;
  dni: string;
}

interface SeparationRequest {
  client: Client;
  detailsSeparation: {
    codToday: string;
    type: string;
    repositoryType: string;
    price: number;
    size?: string[];
    amount?: number;
  }[];
  detailsAmortization: {
    account: number;
    pay: string;
  }[];
}

@Component({
  selector: 'app-register-separation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    SizeFormatPipe, RepositoryTypeColorPipe],
  templateUrl: './register-separation.component.html',
  styleUrl: './register-separation.component.css'
})
export class RegisterSeparationComponent implements OnInit {

  searchCodToday: string = '';
  searchCompany: string = '';

  // Resultados de búsqueda
  searchResults: ProductResult[] = [];

  // Tallas seleccionadas (historial)
  selectedSizes: SelectedSize[] = [];

  // Productos separados finales
  separatedProducts: SeparatedProduct[] = [];

  // Cliente
  client: Client = {
    name: '',
    lastName: '',
    dni: ''
  };

  // Amortizaciones
  amortizations: Amortization[] = [
    { payType: 'Cash', amount: 0 }
  ];

  // Opciones de pago
  paymentMethods = [
    { value: 'Cash', label: 'Efectivo' },
    { value: 'Card', label: 'Tarjeta' },
    { value: 'Debito', label: 'Debito' },
    { value: 'Plim', label: 'Plim' },
    { value: 'Yape', label: 'Yape' }
  ];

  // Estados de carga
  isSearching = false;
  isSaving = false;

  // Cantidad para productos UNICO
  unicoAmounts: { [key: number]: number } = {};

  constructor(
    private filterService: FilterSlipperService,
    private separationService: SeparationService,
    private router: Router
  ) { }

  ngOnInit() { }

  // Buscar productos
  searchProducts() {
    if (!this.searchCodToday && !this.searchCompany) {
      alert('Por favor ingrese un código o compañía para buscar');
      return;
    }

    this.isSearching = true;
    this.filterService.buscarPorCodTodayOCompany3(
      this.searchCodToday || undefined,
      this.searchCompany || undefined
    ).subscribe({
      next: (results: ProductResult[]) => {
        this.searchResults = results;
        // Inicializar cantidades para productos UNICO
        this.searchResults.forEach(product => {
          if (product.producto === 'UNICO') {
            this.unicoAmounts[product.id] = 1;
          }
        });
        this.isSearching = false;
      },
      error: (error) => {
        this.isSearching = false;
        alert('Producto no  Existe o Producto no es Calzado');
      }
    });
  }

  // Obtener tallas disponibles (con cantidad > 0)
  getAvailableSizes(product: ProductResult): { size: string, quantity: number }[] {
    const sizes: { size: string, quantity: number }[] = [];

    if (product.sizes) {
      Object.keys(product.sizes).forEach(sizeKey => {
        const quantity = product.sizes[sizeKey];
        if (quantity > 0) {
          sizes.push({ size: sizeKey, quantity });
        }
      });
    }

    return sizes;
  }

  // Seleccionar talla (agregar al historial)
  selectSize(product: ProductResult, size: string) {
    const selectedSize: SelectedSize = {
      id: `${product.id}-${size}-${Date.now()}`,
      size: size,
      product: product
    };

    this.selectedSizes.push(selectedSize);
  }

  // Remover talla del historial
  removeSizeFromHistory(sizeId: string) {
    this.selectedSizes = this.selectedSizes.filter(s => s.id !== sizeId);
  }

  // Agregar tallas seleccionadas a la separación
  addSizesToSeparation() {
    if (this.selectedSizes.length === 0) {
      alert('No hay tallas seleccionadas');
      return;
    }

    // Agrupar por producto
    const groupedByProduct: { [key: string]: SelectedSize[] } = {};

    this.selectedSizes.forEach(selectedSize => {
      const key = `${selectedSize.product.id}-${selectedSize.product.repositoryType}`;
      if (!groupedByProduct[key]) {
        groupedByProduct[key] = [];
      }
      groupedByProduct[key].push(selectedSize);
    });

    // Crear productos separados
    Object.keys(groupedByProduct).forEach(key => {
      const sizes = groupedByProduct[key];
      const product = sizes[0].product;
      const sizesArray = sizes.map(s => s.size);

      const existingProduct = this.separatedProducts.find(p =>
        p.codToday === product.codToday &&
        p.repositoryType === product.repositoryType
      );

      if (existingProduct) {
        // Agregar tallas al producto existente
        sizesArray.forEach(size => {
          if (!existingProduct.sizes.includes(size)) {
            existingProduct.sizes.push(size);
          } else {
            // Si la talla ya existe, duplicarla
            existingProduct.sizes.push(size);
          }
        });
        existingProduct.subTotal = existingProduct.sizes.length * product.price;
      } else {
        // Crear nuevo producto separado
        const separatedProduct: SeparatedProduct = {
          id: `${product.id}-${product.repositoryType}-${Date.now()}`,
          codToday: product.codToday,
          brand: product.brand,
          type: product.type,
          producto: product.producto,
          genero: product.genero,
          repositoryType: product.repositoryType,
          price: product.price,
          sizes: sizesArray,
          urlImg: product.urlImg,
          subTotal: sizesArray.length * product.price
        };

        this.separatedProducts.push(separatedProduct);
      }
    });

    // Limpiar historial de tallas seleccionadas
    this.selectedSizes = [];
  }

  // Agregar producto UNICO a la separación
  addUnicoToSeparation(product: ProductResult) {
    const amount = this.unicoAmounts[product.id] || 1;

    if (amount <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    const existingProduct = this.separatedProducts.find(p =>
      p.codToday === product.codToday &&
      p.repositoryType === product.repositoryType &&
      p.producto === 'UNICO'
    );

    if (existingProduct) {
      existingProduct.amount = (existingProduct.amount || 0) + amount;
      existingProduct.subTotal = existingProduct.amount * product.price;
    } else {
      const separatedProduct: SeparatedProduct = {
        id: `${product.id}-${product.repositoryType}-${Date.now()}`,
        codToday: product.codToday,
        brand: product.brand,
        type: product.type,
        producto: product.producto,
        genero: product.genero,
        repositoryType: product.repositoryType,
        price: product.price,
        sizes: ['UNICO'],
        amount: amount,
        urlImg: product.urlImg,
        subTotal: amount * product.price
      };

      this.separatedProducts.push(separatedProduct);
    }

  }

  // Remover producto de la separación
  removeProductFromSeparation(productId: string) {
    this.separatedProducts = this.separatedProducts.filter(p => p.id !== productId);
  }

  // Remover talla específica de un producto separado
  removeSizeFromProduct(productId: string, sizeIndex: number) {
    const product = this.separatedProducts.find(p => p.id === productId);
    if (product) {
      product.sizes.splice(sizeIndex, 1);

      if (product.sizes.length === 0) {
        this.removeProductFromSeparation(productId);
      } else {
        if (product.producto === 'UNICO') {
          product.amount = product.sizes.length;
        }
        product.subTotal = product.sizes.length * product.price;
      }
    }
  }

  // Editar cantidad de producto UNICO
  editUnicoAmount(productId: string, newAmount: number) {
    const product = this.separatedProducts.find(p => p.id === productId);
    if (product && product.producto === 'UNICO') {
      if (newAmount <= 0) {
        this.removeProductFromSeparation(productId);
      } else {
        product.amount = newAmount;
        product.sizes = Array(newAmount).fill('UNICO');
        product.subTotal = newAmount * product.price;
      }
    }
  }

  // Agregar nueva amortización
  addAmortization() {
    this.amortizations.push({ payType: 'Cash', amount: 0 });
  }

  // Remover amortización
  removeAmortization(index: number) {
    if (this.amortizations.length > 1) {
      this.amortizations.splice(index, 1);
    }
  }

  // Obtener total de la separación
  getTotalSeparation(): number {
    return this.separatedProducts.reduce((total, product) => total + product.subTotal, 0);
  }

  // Obtener total de amortizaciones
  getTotalAmortizations(): number {
    return this.amortizations.reduce((total, amort) => total + amort.amount, 0);
  }

  // Validar formulario
  isFormValid(): boolean {
    return (
      this.client.name.trim() !== '' &&
      this.client.lastName.trim() !== '' &&
      this.client.dni.trim() !== '' &&
      this.separatedProducts.length > 0 &&
      this.amortizations.some(a => a.amount > 0)
    );
  }

  // Guardar separación
  saveSeparation() {
    if (!this.isFormValid()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.isSaving = true;

    const separationRequest: SeparationRequest = {
      client: this.client,
      detailsSeparation: this.separatedProducts.map(product => ({
        codToday: product.codToday,
        type: product.type,
        repositoryType: product.repositoryType,
        price: product.price,
        size: product.producto !== 'UNICO' ? product.sizes : undefined,
        amount: product.producto === 'UNICO' ? product.amount : undefined
      })),
      detailsAmortization: this.amortizations
        .filter(a => a.amount > 0)
        .map((amort, index) => ({
          account: amort.amount,
          pay: amort.payType
        }))
    };

    this.separationService.saveSeparation(separationRequest as any).subscribe({
      next: (response) => {
        alert('Separación guardada exitosamente');
        this.router.navigate(['/main-client-separation-amortization']);
      },
      error: (error) => {
        alert('Error al guardar la separación');
        this.isSaving = false;
      }
    });
  }

  // Limpiar formulario
  clearForm() {
    this.searchCodToday = '';
    this.searchCompany = '';
    this.searchResults = [];
    this.selectedSizes = [];
    this.separatedProducts = [];
    this.client = { name: '', lastName: '', dni: '' };
    this.amortizations = [{ payType: 'Cash', amount: 0 }];
    this.unicoAmounts = {};
  }

  // Actualizar precio en tiempo real mientras se escribe
  updatePriceInput(product: any, event: Event) {
    const target = event.target as HTMLInputElement;
    const newPrice = parseFloat(target.value);

    if (!isNaN(newPrice) && newPrice >= 0) {
      product.price = newPrice;
      this.recalculateSubtotal(product);
    }
  }

  // Validar precio al perder el foco
  validatePrice(product: any, event: Event) {
    const target = event.target as HTMLInputElement;
    const newPrice = parseFloat(target.value);

    if (isNaN(newPrice) || newPrice < 0) {
      // Restaurar precio anterior si es inválido
      target.value = product.price.toString();
      alert('Por favor ingrese un precio válido mayor o igual a 0');
      return;
    }

    product.price = newPrice;
    this.recalculateSubtotal(product);
  }

  // Método auxiliar para recalcular subtotal
  private recalculateSubtotal(product: any) {
    if (product.producto === 'UNICO') {
      product.subTotal = (product.amount || 1) * product.price;
    } else {
      product.subTotal = product.sizes.length * product.price;
    }
  }

  // Método updatePrice original mejorado (por si prefieres mantener contenteditable)
  updatePrice(product: any, event: FocusEvent) {
    const target = event.target as HTMLElement;
    const newPriceText = target.innerText.replace('S/ ', '').replace('S/', '').trim();
    const newPrice = parseFloat(newPriceText);

    if (isNaN(newPrice) || newPrice < 0) {
      target.innerText = `S/ ${product.price.toFixed(2)}`;
      alert('Por favor ingrese un precio válido');
      return;
    }

    product.price = newPrice;
    this.recalculateSubtotal(product);

    // Formatear la visualización
    target.innerText = `S/ ${newPrice.toFixed(2)}`;
  }

}

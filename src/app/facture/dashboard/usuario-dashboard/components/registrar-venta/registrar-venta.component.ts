import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender, Sale, Size, SizesByGender } from '../../../../../shared/models/sale';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SaleDataService } from '../../../../service/sale-data.service';
import { NavbarVentasComponent } from "../../../../../shared/components/navbars/navbar-ventas/navbar-ventas.component";


@Component({
  selector: 'app-registrar-venta',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NavbarVentasComponent],
  templateUrl: './registrar-venta.component.html',
  styleUrl: './registrar-venta.component.css'
})
export class RegistrarVentaComponent implements OnInit {
  message: string | undefined = '';
  saleForm!: FormGroup;
  genders: Gender[] = [];
  allSizes: SizesByGender = {
    hombre: [],
    mujer: [],
    niño: [],
    niña: [],
    bebé: []
  };
  availableSizes: Size[][] = [];
  repositoryTypes = ['ALMACEN', 'VITRINA'];
  //repositoryTypes = ['ALMACEN', 'VITRINA', 'VITRINAB'];
  productTypes = ['MEDIAS', 'CANGURO', 'BOTINES','ZAPATILLA', 'GORRA', 'SANDALIA', 'POLO', 'POLERA', 'PANTALON'];
  payTypes = [
    { label: 'Plim', value: 'Plim' },
    { label: 'Yape', value: 'Yape' },
    { label: 'Efectivo', value: 'Cash' },
    { label: 'Tarjeta', value: 'Card' },
    { label: 'Debito', value: 'Debito' },
    { label: 'Otros', value: 'Otros' }
  ];
  filteredGenders: Gender[] = [];


  registrationSuccess = false;

  constructor(
    private fb: FormBuilder,
    private dataService: SaleDataService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadGenders();
    this.loadSizes();

    // Suscripción a cambios en el payType del primer producto
    const firstPayTypeControl = this.details.at(0).get('payType');
    if (firstPayTypeControl) {
      firstPayTypeControl.valueChanges.subscribe(() => {
        this.updatePayTypesForAll();
      });
    }
  }

  updatePayTypesForAll(): void {
    const firstDetail = this.details.at(0);
    const firstPayTypeControl = firstDetail?.get('payType');
    const firstPayType = firstPayTypeControl ? firstPayTypeControl.value : null;

    if (firstPayType === null) {
      return;
    }

    this.details.controls.forEach((ctrl, idx) => {
      const payTypeControl = ctrl.get('payType');
      if (!payTypeControl) {
        return;
      }

      if (idx === 0) {
        payTypeControl.enable();
        return;
      }

      if (firstPayType === 'Otros') {
        payTypeControl.setValue('Otros');
        payTypeControl.disable();
      } else {
        if (payTypeControl.value === 'Otros') {
          const alternativePayType = this.payTypes.find(pt => pt.value !== 'Otros')?.value || 'Plim';
          payTypeControl.setValue(alternativePayType);
        }
        payTypeControl.enable();
      }
    });
  }


  getAvailablePayTypes(index: number): any[] {
    const firstPayType = this.details.at(0).get('payType')?.value;

    if (index === 0) {
      // Primer producto puede seleccionar todos los métodos (incluyendo Otros)
      return this.payTypes;
    } else {
      // Productos subsiguientes solo pueden elegir entre los 4 métodos principales si el primero no es Otros
      if (firstPayType === 'Otros') {
        return this.payTypes.filter(pt => pt.value === 'Otros');
      } else {
        return this.payTypes.filter(pt => pt.value !== 'Otros');
      }
    }
  }



  createForm(): void {
    this.saleForm = this.fb.group({
      ticket: this.fb.group({
        sellerName: ['', Validators.required],
        clientName: ['', Validators.required],
        clientLastName: ['', Validators.required],
        dni: ['', Validators.required]
      }),
      details: this.fb.array([this.createDetailForm()])
    });
  }

  createDetailForm(): FormGroup {
    return this.fb.group({
      repositoryType: ['ALMACEN', Validators.required],
      type: ['', Validators.required],
      ticketType: ['Registrado'], // Read-only field
      payType: ['Plim', Validators.required],
      codToday: ['', Validators.required],
      amount: [1, Validators.required],
      price: [, [Validators.required, Validators.min(0)]],
      genero: ['', Validators.required],
      sizes: [[]]
    });
  }

  get details(): FormArray {
    return this.saleForm.get('details') as FormArray;
  }

  addProductDetail(): void {
    const detail = this.createDetailForm();

    // Mantener el manejo de payType
    const firstDetail = this.details.at(0);
    const firstPayTypeControl = firstDetail?.get('payType');
    const firstPayType = firstPayTypeControl ? firstPayTypeControl.value : null;

    if (firstPayType === 'Otros') {
      detail.get('payType')?.setValue('Otros');
      detail.get('payType')?.disable();
    } else {
      const payTypeControl = detail.get('payType');
      if (payTypeControl) {
        if (payTypeControl.value === 'Otros') {
          payTypeControl.setValue('Plim');
        }
        payTypeControl.enable();
      }
    }

    this.details.push(detail);
    this.availableSizes.push([]); // ← Inicializar lista de tallas para este producto
  }



  removeProductDetail(index: number): void {
    if (this.details.length > 1) {
      this.details.removeAt(index);
    }
  }

  loadGenders(): void {
    this.dataService.getGenero().subscribe(data => {
      this.genders = data;
    });
  }

  loadSizes(): void {
    this.dataService.getTalla().subscribe(data => {
      this.allSizes = data;
    });
  }

  onProductTypeChange(detailIndex: number): void {
    const detailForm = this.details.at(detailIndex) as FormGroup;
    const productType = detailForm.get('type')?.value;
    const gender = detailForm.get('genero')?.value;

    // Reset fields
    detailForm.get('sizes')?.setValue([]);
    this.availableSizes[detailIndex] = [];

    if (productType === 'BOTINES' || productType === 'ZAPATILLA' || productType === 'SANDALIA') {
      // Para calzado: habilitar género (todas las opciones)
      detailForm.get('genero')?.enable();
      this.filteredGenders = this.genders; // Mostrar todos los géneros
      detailForm.get('sizes')?.enable();
      detailForm.get('amount')?.disable();
      if (gender) {
        this.onGenderChange(detailIndex);
      }
    } else if (productType === 'POLO' || productType === 'POLERA' || productType === 'PANTALON') {
      // Para ropa: habilitar género pero solo Hombre/Mujer
      detailForm.get('genero')?.enable();
      this.filteredGenders = this.genders.filter(g => g.nombre === 'Hombre' || g.nombre === 'Mujer');
      detailForm.get('sizes')?.enable();
      detailForm.get('amount')?.disable();

      // Cargar tallas de ropa
      this.availableSizes[detailIndex] = [
        { id: 1, talla: 'xs' },
        { id: 2, talla: 's' },
        { id: 3, talla: 'm' },
        { id: 4, talla: 'l' },
        { id: 5, talla: 'xl' }
      ];

      // Seleccionar Hombre por defecto si no hay selección
      if (!gender) {
        detailForm.get('genero')?.setValue('Hombre');
      }
    } else if (productType === 'GORRA' || productType === 'CANGURO' || productType === 'MEDIAS') {
      detailForm.get('genero')?.enable(); // Permitir seleccionar género
      this.filteredGenders = this.genders;
      detailForm.get('sizes')?.disable();
      detailForm.get('amount')?.enable();
    }
    else {
      detailForm.get('genero')?.disable();
      detailForm.get('sizes')?.disable();
      detailForm.get('amount')?.enable();
    }

  }

  onGenderChange(detailIndex: number): void {
    const detailForm = this.details.at(detailIndex) as FormGroup;
    const gender = detailForm.get('genero')?.value?.toLowerCase();
    const productType = detailForm.get('type')?.value;

    if (productType === 'ZAPATILLA' || productType === 'SANDALIA'|| productType === 'BOTINES') {
      if (gender && this.allSizes[gender as keyof SizesByGender]) {
        this.availableSizes[detailIndex] = this.allSizes[gender as keyof SizesByGender];
      } else {
        this.availableSizes[detailIndex] = [];
      }
    }
    detailForm.get('sizes')?.setValue([]);
  }
  shouldDisableGender(index: number): boolean {
    const productType = this.details.at(index).get('type')?.value;

    return false;

  }

  getFilteredGenders(index: number): Gender[] {
    const productType = this.details.at(index).get('type')?.value;

    if (productType === 'POLO' || productType === 'POLERA' || productType === 'PANTALON') {
      // Solo Hombre y Mujer para ropa
      return this.genders.filter(g => g.nombre === 'Hombre' || g.nombre === 'Mujer');
    }
    else if (productType === 'GORRA' || productType === 'CANGURO' || productType === 'MEDIAS') {
      // Todos los géneros para accesorios
      return this.genders;
    }
    else if (productType === 'BOTINES' || productType === 'ZAPATILLA' || productType === 'SANDALIA') {
      // Todos los géneros para calzado
      return this.genders;
    }

    // Por defecto, todos los géneros
    return this.genders;
  }


  onSubmit(): void {
    if (this.saleForm.valid) {
      let isValid = true;

      // Validar que cada detalle tenga tallas o cantidad mayor a cero
      this.details.controls.forEach(ctrl => {
        const productType = ctrl.get('type')?.value;
        const sizes = ctrl.get('sizes')?.value;
        const amount = ctrl.get('amount')?.value;

        if ((productType === 'POLO' || productType === 'POLERA' || productType === 'PANTALON') && (!sizes || sizes.length === 0)) {
          isValid = false;
        } else if (productType !== 'POLO' && productType !== 'POLERA' && productType !== 'PANTALON' && (!amount || amount <= 0)) {
          isValid = false;
        }
      });

      if (!isValid) {
        this.message = 'El detalle debe tener tallas o cantidad mayor a cero.';
        this.showErrorMessage(this.message);
        return;
      }

      // Habilita temporalmente los controles deshabilitados
      this.details.controls.forEach(ctrl => {
        const payTypeControl = ctrl.get('payType');
        if (payTypeControl?.disabled) {
          payTypeControl.enable();
        }
      });

      const saleData: Sale = this.saleForm.value;

      // Limpia los datos antes de enviar
      saleData.details.forEach(detail => {
        if (detail.type !== 'BOTINES' && detail.type !== 'ZAPATILLA' && detail.type !== 'SANDALIA') {
          delete detail.gender;
        } else {
          delete detail.amount;
          if (!detail.gender) {
            detail.gender = '';
          }
        }
      });

      this.dataService.registerSale(saleData).subscribe({
        next: (response) => {
          if (response.error) {
            this.registrationSuccess = false;
            this.message = response.error;
            this.showErrorMessage(this.message);
          } else {
            this.registrationSuccess = true;
            this.message = response.message;
          }
        },
        error: (error) => {
          this.registrationSuccess = false;
          this.message = error.error?.error || error.error?.message || 'Ocurrió un error al registrar la venta';
          this.showErrorMessage(this.message);
          console.error('Error registering sale:', error);
        }
      });

      // Vuelve a deshabilitar los controles si es necesario
      this.updatePayTypesForAll();
    } else {
      this.markFormGroupTouched(this.saleForm);
    }
  }


  //Mensaje de error temporal 
  // Método para mostrar mensaje de error
  showErrorMessage(message: string | undefined): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4500); // Oculta el mensaje después de 3 segundos
  }
  trackBySize(index: number, item: Size): number | string {
    return item.talla; // usa la talla como clave única
  }


  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          this.markFormGroupTouched(control.at(i) as FormGroup);
        }
      }
    });
  }

  backToMainVenta(): void {
    this.router.navigate(['/main-venta']);
  }

  continueRegistering(): void {
    // Reset form but keep client data
    const clientData = this.saleForm.get('ticket')?.value;
    this.saleForm.reset();
    this.saleForm.get('ticket')?.setValue(clientData);
    this.details.clear();
    this.details.push(this.createDetailForm());
    this.registrationSuccess = false;
  }

  clothingSizes = [
    { value: 'xs', label: 'XS' },
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' }
  ];

}

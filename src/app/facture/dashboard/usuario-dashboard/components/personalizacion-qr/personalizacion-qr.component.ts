import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../../service/data.service';
import { QrCodeService } from '../../../../service/qr-code.service';
import { CommonModule } from '@angular/common';
import { FilterSlipperService } from '../../../../service/filter-slipper.service';

@Component({
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  selector: 'app-personalizacion-qr',
  templateUrl: './personalizacion-qr.component.html',
  styleUrls: ['./personalizacion-qr.component.css']
})
export class PersonalizacionQrComponent implements OnInit {
  form!: FormGroup;
  searchForm!: FormGroup;
  showSearchModal: boolean = false;
  productosList: any[] = [];
  editIndex: number | null = null;
  searchResults: any = null;
  isLoading: boolean = false;
  searchError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private qrService: QrCodeService,
    private busquedaService: FilterSlipperService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      codToday: ['', Validators.required]
    });
    this.form = this.fb.group({
      amount: [1, [Validators.required, Validators.min(1)]]
    });
  }

  openSearchModal() {
    this.showSearchModal = true;
    this.searchResults = null;
    this.searchError = null;
    this.searchForm.reset();
  }

  closeSearchModal() {
    this.showSearchModal = false;
  }

  buscarProducto() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.searchError = null;
    const codToday = this.searchForm.get('codToday')?.value;
    this.busquedaService.buscarPorCodToday(codToday).subscribe({
      next: (response) => {
        this.searchResults = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.searchError = 'No se encontró el producto con el código proporcionado';
        this.isLoading = false;
      }
    });
  }

  agregarALista() {
    if (this.form.invalid || !this.searchResults || this.bloquearAcciones) {
      return;
    }
    const producto = {
      ...this.searchResults,
      amount: this.form.get('amount')?.value
    };
    this.productosList.push(producto);
    this.form.reset({ amount: 1 });
    this.searchResults = null;
    this.searchForm.reset();
    this.actualizarTotalQrs();
  }

  removeProducto(index: number) {
    this.productosList.splice(index, 1);
    this.actualizarTotalQrs();
  }


  editProducto(index: number) {
    this.editIndex = index;
  }

  saveProducto(index: number) {
    this.editIndex = null;
  }

  generarQR() {
    if (this.productosList.length === 0) {
      alert('No hay productos para generar QR.');
      return;
    }
    this.qrService.generateQrCodes(this.productosList).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  //La Advertencia
  mostrarAdvertencia: boolean = true;

  cerrarAdvertencia() {
    this.mostrarAdvertencia = false;
  }

  //para desabilitar 
  totalQrsGenerados: number = 0;
  LIMITE_QR: number = 800;
  bloquearAcciones: boolean = false;

  actualizarTotalQrs(): void {
    const total = this.productosList.reduce((acc, prod) => acc + (Number(prod.amount) * 2), 0);
    this.totalQrsGenerados = total;
    this.bloquearAcciones = total > this.LIMITE_QR;

    // Mostrar u ocultar la advertencia según el total
    if (total > this.LIMITE_QR) {
      this.mostrarAdvertencia = true;
    } else {
      this.mostrarAdvertencia = false;
    }
  }



}

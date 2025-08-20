import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SaleDataService } from '../../../../service/sale-data.service';
import { Gender, Size, SizesByGender } from '../../../../../shared/models/sale';

@Component({
  selector: 'app-update-separation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-separation-modal.component.html',
  styleUrl: './update-separation-modal.component.css'
})
export class UpdateSeparationModalComponent implements OnInit {

  @Input() data: any;
  @Output() cancel = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();


  // Listas para selects
  productos = ['CALZADO'];
  //repositoryTypes = ['ALMACEN', 'VITRINA', 'VITRINAB'];
  repositoryTypes = ['ALMACEN', 'VITRINA'];

  generos: Gender[] = [];
  tallas: Size[] = [];

  sizeString: string = '';


  ngOnInit(): void {
    // Cargar géneros
    this.saleDataService.getGenero().subscribe(generos => {
      this.generos = generos;
      // Si data.genero viene, aseguramos que exista en la lista
      if (this.data.genero && !this.generos.find(g => g.nombre === this.data.genero)) {
        this.generos.push({ id: 0, nombre: this.data.genero });
      }
      // Cargar tallas según género inicial
      this.loadTallas(this.data.genero);
    });

    // Inicializar sizeString desde data.size (array o string)
    if (Array.isArray(this.data.size)) {
      this.sizeString = this.data.size.join(', ');
    } else if (typeof this.data.size === 'string') {
      this.sizeString = this.data.size;
    }
  }
  constructor(
    private saleDataService: SaleDataService,
  ) { }


  onGeneroChange(generoNombre: string) {
    this.data.genero = generoNombre;
    this.loadTallas(generoNombre);
    // Reset talla si no está en nueva lista
    if (!this.tallas.find(t => this.sizeString === t.talla)) {
      this.sizeString = '';
    }
  }

  loadTallas(generoNombre: string) {
    if (!generoNombre) {
      this.tallas = [];
      return;
    }
    this.saleDataService.getTalla().subscribe(tallasByGenero => {
      // Mapear género a clave en tallas.json (todo en minúsculas)
      const key = generoNombre.toLowerCase();
      let tallasRaw = tallasByGenero[key as keyof SizesByGender] || [];

      // Transformar tallas según reglas de presentación
      this.tallas = tallasRaw.map(t => {
        let displayTalla = t.talla;
        if (key === 'bebe') {
          // Ejemplo: "17.0" => "17" y "17.5" => "17.5"
          displayTalla = t.talla.endsWith('.0') ? t.talla.slice(0, -2) : t.talla;
        } else if (key === 'niño' || key === 'niña') {
          // Mostrar como "29" o "29.5"
          displayTalla = t.talla.endsWith('.0') ? t.talla.slice(0, -2) : t.talla;
        } else if (key === 'hombre' || key === 'mujer') {
          // Mostrar como "7" o "7.5"
          displayTalla = t.talla.endsWith('.0') ? t.talla.slice(0, -2) : t.talla;
        }
        return { id: t.id, talla: displayTalla };
      });
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  onAccept() {
    // Guardar talla seleccionada en data.size como array (puedes ajustar según necesidad)
    this.data.size = [this.sizeString];
    this.accept.emit(this.data);
  }

  // Para mostrar el campo cantidad solo para ciertos tipos
  showAmountField(): boolean {
    return ['GORRA', 'MEDIAS', 'CANGURO'].includes(this.data.type);
  }

  get filteredTypes() {
    if (this.data.producto === 'CALZADO' || this.data.type === 'ROPA') {
      return this.productos.filter(t => !['UNICO'].includes(t));
    }
    return this.productos;
  }
}

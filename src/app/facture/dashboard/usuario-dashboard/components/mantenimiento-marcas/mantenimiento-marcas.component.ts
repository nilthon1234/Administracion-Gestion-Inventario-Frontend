import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Marca } from '../../../../../shared/models/marcas';
import { NavBarsMantenimientosComponent } from "../../../../../shared/components/navbars/nav-bars-mantenimientos/nav-bars-mantenimientos.component";

@Component({
  selector: 'app-mantenimiento-marcas',
  imports: [CommonModule, FormsModule, NavBarsMantenimientosComponent],
  templateUrl: './mantenimiento-marcas.component.html',
  styleUrls: ['./mantenimiento-marcas.component.css']
})
export class MantenimientoMarcasComponent implements OnInit {
  marcas: Marca[] = [];
  newName: string = '';
  searchTerm: string = '';
  editingMarca: Marca | null = null;
  private allMarcas: Marca[] = []; // Almacena todas las marcas para poder restaurarlas

  constructor(private marcasService: DataService) { }

  ngOnInit(): void {
    this.getMarcas();
  }

  getMarcas(): void {
    this.marcasService.getMarca().subscribe(
      (data: Marca[]) => {
        this.marcas = data;
        this.allMarcas = [...data]; // Guarda una copia de todas las marcas
      },
      error => {
        alert('Error al cargar las marcas');
      }
    );
  }

  addName(): void {
    if (this.newName.trim()) {
      this.marcasService.saveMarca(this.newName).subscribe(
        (mensaje: string) => {
          alert(mensaje);
          if (mensaje.includes('exitosamente')) {
            this.getMarcas();
            this.newName = '';
          }
        },
        (error) => {
          console.error('Error técnico:', error);
          alert('Nombre ya existe: ' + this.newName);
        }
      );
    }
  }

  searchName(): void {
    if (this.searchTerm.trim()) {
      this.marcas = this.allMarcas.filter(marca =>
        marca.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.marcas = [...this.allMarcas]; // Restaura todas las marcas si el término de búsqueda está vacío
    }
  }

  updateName(marca: Marca): void {
    const nuevoNombre = prompt('Nuevo nombre de marca:', marca.nombre);
    if (nuevoNombre && nuevoNombre.trim()) {
      this.marcasService.upDateMarca(marca.id, nuevoNombre).subscribe(
        () => {
          this.getMarcas();
        },
        error => {
          alert('Error al actualizar la marca');
        }
      );
    }
  }

  deleteName(marca: Marca): void {
    if (confirm(`¿Eliminar la marca "${marca.nombre}"?`)) {
      this.marcasService.deleteMarca(marca.id).subscribe(
        () => {
          this.getMarcas();
        },
        error => {
          alert('Error al eliminar la marca');
        }
      );
    }
  }
  //Nota
  showNotification: boolean = true;
  closeNotification() {
    this.showNotification = false;
  }
  onNewNameChange() {
    this.newName = this.newName.replace(/\s/g, '');
  }

}

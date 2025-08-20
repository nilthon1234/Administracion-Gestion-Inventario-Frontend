import { Component } from '@angular/core';
import { NavBarsMantenimientosComponent } from "../../../../../shared/components/navbars/nav-bars-mantenimientos/nav-bars-mantenimientos.component";
import { Vitrina } from '../../../../../shared/models/vitrina';
import { VitrinaBService } from '../../../../service/vitrina-b.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { VitrinaAService } from '../../../../service/vitrina-a.service';
import { MessageModalComponent } from '../../../../../shared/components/message-modal/message-modal.component';
@Component({
  selector: 'app-mantenimiento-vitrinas',
  standalone: true,
  imports: [
    NavBarsMantenimientosComponent,
    CommonModule,
    FormsModule,
    CustomDateFormatPipe,CustomDateFormatPipe,
    MessageModalComponent // Añade MessageModalComponent a los imports
  ],
  templateUrl: './mantenimiento-vitrinas.component.html',
  styleUrls: ['./mantenimiento-vitrinas.component.css']
})
export class MantenimientoVitrinasComponent {
  codToday: string = '';
  codToday1: string = '';
  vitrina!: Vitrina;
  showModal: boolean = false;
  showModalA: boolean = false;
  message: string = '';
  showMessageModal: boolean = false;
  isError: boolean = false;

  constructor(
    private vitrinaBService: VitrinaBService,
    private vitrinaService: VitrinaAService
  ) {}

  search() {
    this.vitrinaBService.getByCodToday(this.codToday).subscribe({
      next: (data) => {
        this.vitrina = data;
        this.showModal = true;
      },
      error: (error) => {
        this.showMessage('No se encontró ningun código: ' + this.codToday + ' en Vitrina B', true);
      }
    });
  }

  delete() {
    if (this.vitrina) {
      this.vitrinaBService.deleteByCodToday(this.vitrina.codToday).subscribe({
        next: (message) => {
          this.showMessage(message, false);
          this.showModal = false;
        },
        error: (error) => {
          this.showMessage( error.message, true);
        }
      });
    }
  }

  cancel() {
    this.showModal = false;
  }

  searchA() {
    this.vitrinaService.getByCodToday(this.codToday1).subscribe({
      next: (data) => {
        this.vitrina = data;
        this.showModalA = true;
      },
      error: (error) => {
        this.showMessage('No se encontró ningun código: ' + this.codToday1 + ' en Vitrina A', true);
      }
    });
  }

  deleteA() {
    if (this.vitrina) {
      this.vitrinaService.deleteByCodToday(this.vitrina.codToday).subscribe({
        next: (message) => {
          this.showMessage(message, false);
          this.showModalA = false;
        },
        error: (error) => {
          this.showMessage( error.message, true);
        }
      });
    }
  }

  cancelA() {
    this.showModalA = false;
  }

  showMessage(message: string, isError: boolean) {
    this.message = message;
    this.isError = isError;
    this.showMessageModal = true;
  }

  closeMessage() {
    this.showMessageModal = false;
  }
}

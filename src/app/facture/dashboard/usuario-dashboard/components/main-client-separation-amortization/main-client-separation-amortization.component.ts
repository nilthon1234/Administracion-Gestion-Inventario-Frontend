import { Component, inject, OnInit, signal } from '@angular/core';
import { SeparationService } from '../../../../service/separation.service';
import { Client } from '../../../../../shared/models/client';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { UpdateSeparationModalComponent } from "../update-separation-modal/update-separation-modal.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { DevolucionesService } from '../../../../service/devoluciones.service';
import { ErrorResponse, SuccessResponse } from '../../../../../shared/models/DescarteResponse';
import { RuleService } from '../../../../service/rule.service';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-main-client-separation-amortization',
  imports: [CommonModule,SizeFormatPipe, FormsModule, RouterLink, CopiarTextoDirective,UpdateSeparationModalComponent, 
    MatPaginatorModule,PayTypeTranslatePipe,CustomDateFormatPipe],
  templateUrl: './main-client-separation-amortization.component.html',
  styleUrl: './main-client-separation-amortization.component.css'
})
export class MainClientSeparationAmortizationComponent implements OnInit{

  private clientService = inject(SeparationService);
  private devolucionService = inject(DevolucionesService);
  clients = signal<Client[]>([]);
  expandedClients = signal<string[]>([]);

  filteredClients = signal<Client[]>([]);

  //Para la paginacion
  currentPage: number = 0;
  pageSize: number = 2;
  totalElements: number = 0;
  totalPages: number = 0;


  dniFilter = signal<string>('');
  idFilter = signal<string>('');

  constructor(private ruleService: RuleService,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.loadRule();
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        const sortedData = this.sortClientsDescending(data.content);
        this.clients.set(sortedData);
        this.filteredClients.set(sortedData);

        // Actualizar información de paginación
        this.totalElements = data.totalElements;

      },
      error: (error) => {
      }
    });
  }
  // Método para manejar cambios de página
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClients();
  }

  resetPagination(): void {
    this.currentPage = 0;
    this.pageSize = 2;
    this.loadClients();
  }


  toggleDetails(id: string) {
    const current = this.expandedClients();
    if (current.includes(id)) {
      this.expandedClients.set(current.filter(c => c !== id));
    } else {
      this.expandedClients.set([...current, id]);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedClients().includes(id);
  }

  applyFilters() {
    // Obtener valores de los filtros
    const dni = this.dniFilter().trim().toLowerCase();
    const id = this.idFilter().trim().toLowerCase();

    // Si no hay filtros aplicados, cargar datos normales
    if (!dni && !id) {
      this.resetPagination();
      return;
    }

    // Cargar TODOS los clientes para filtrar correctamente
    this.clientService.getAllClients(0, 10000).subscribe({
      next: (data) => {
        const allClients = data.content;

        // Aplicar filtros
        const filtered = allClients.filter((client: Client) => {
          const clientDni = client.dni ? String(client.dni).toLowerCase() : '';
          const clientId = client.id ? client.id.toLowerCase() : '';

          const matchesDni = dni === '' || clientDni.includes(dni);
          const matchesId = id === '' || clientId.includes(id);

          return matchesDni && matchesId;
        });

        // Actualizar las señales con los resultados filtrados
        this.filteredClients.set(this.sortClientsDescending(filtered));
        this.totalElements = filtered.length;
        this.currentPage = 0; // Resetear a la primera página

        // Actualizar la lista completa de clientes
        this.clients.set(this.sortClientsDescending(allClients));
      },
      error: (error) => {
      }
    });
  }
  clearFilters() {
    this.dniFilter.set('');
    this.idFilter.set('');
    this.resetPagination();
  }

  // Método para ordenar clientes por ID de forma descendente
  private sortClientsDescending(clients: Client[]): Client[] {
    return [...clients].sort((a, b) => {
      // Convertir IDs a números para comparación (asumiendo que son strings numéricos)
      const idA = parseInt(a.id!);
      const idB = parseInt(b.id!);
      return idB - idA;
    });
  }


  // Método para generar, descargar y abrir PDF
  generatePdf(clientId: string, clientName: string, clientLastName: string) {
    this.clientService.generateClientPdf(clientId).subscribe({
      next: (pdfBlob: Blob) => {
        // 1. Crear URL del blob para abrir en nueva pestaña
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');

        // 2. Crear enlace para descarga automática
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;

        // Nombre del archivo: "Nombre Apellido.pdf"
        const fileName = `${clientName} ${clientLastName}.pdf`.replace(/\s+/g, '_');
        downloadLink.download = fileName;

        // Disparar click para descarga
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Liberar memoria después de un tiempo
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 1000);
      },
      error: (error) => {
        alert('Error al generar el PDF');
      }
    });
  }


  // para pasar los datos al amortization

  navigateToAmortization(client: any) {
    this.router.navigate(['/register-amortization'], {
      state: {
        clientData: {
          ...client,
          // Formatear las tallas según sea necesario
          separations: client.separations.map((sep: any) => ({
            ...sep,
            size: this.formatSize(sep.size)
          }))
        }
      }
    });
  }

  private formatSize(size: string): string {
    if (!size) return '';
    return size.replace('_', '.').replace('usa', '').replace('eu', '');
  }

  //Actualizacion separaciones

  modalOpen = false;
  selectedSeparation: any = null;

  openUpdateModal(sep: any) {
    // Hacemos una copia para no modificar el objeto original hasta aceptar
    this.selectedSeparation = { ...sep };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedSeparation = null;
  }

  updateSeparation(updatedData: any) {
    this.clientService.updateSeparation(updatedData.id, updatedData)
      .subscribe({
        next: (resp: string) => {
          // Aquí resp es texto plano, por ejemplo: "Actualización exitosa"
          alert(`✅ Actualizacion Exitosa de la Separacion`);
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          // err.error también es texto plano, por ejemplo: "Error: ID no encontrado"
          const errorMessage = typeof err.error === 'string' ? err.error : 'Error desconocido';
          alert(`❌ ${errorMessage}`);
        }
      });
  }

  updateLocalSeparation(updatedSep: any) {
    const updateFunction = (clientList: Client[]) => {
      return clientList.map(client => {
        const hasSeparation = client.separations.some(s => s.id === updatedSep.id);

        if (hasSeparation) {
          const newSeparations = client.separations.map(s =>
            s.id === updatedSep.id ? { ...updatedSep } : { ...s }
          );

          return {
            ...client,
            separations: newSeparations
          };
        }
        return { ...client };
      });
    };

    // Actualizar ambas señales
    this.clients.update(updateFunction);
    this.filteredClients.update(updateFunction);
  }
  // Para model Descarte
  showDiscardModal = signal(false);
  discardData = signal<any>(null);
  discardMessage = signal<string>('');
  discardType = signal<'success' | 'error' | ''>('');

  openDiscardModal(sep: any) {
    this.discardData.set({
      id: sep.id,
      codToday: sep.codToday,
      price: sep.price
    });
    this.discardMessage.set('');
    this.discardType.set('');
    this.showDiscardModal.set(true);
  }
  closeDiscardModal() {
    this.showDiscardModal.set(false);
    this.discardData.set(null);
    this.discardMessage.set('');
    this.discardType.set('');
  }

  confirmDiscard() {
    const { id } = this.discardData();
    this.devolucionService.deleteSeparation(id).subscribe({
      next: (resp: SuccessResponse) => {
        this.discardMessage.set(resp.reaccion || 'Separación eliminada');
        this.discardType.set('success');
        setTimeout(() => {
          this.closeDiscardModal();
          this.loadClients();
        }, 2000);
      },
      error: (err) => {
        if (err.status === 409) {
          // Manejar específicamente el error 403 Forbidden
          const errorResp = err.error as ErrorResponse;
          this.discardMessage.set(
            errorResp?.mensaje_adicional ||
            errorResp?.mensaje_regla_negocio ||
            'Acceso denegado: no tiene permiso para esta acción.'
          );
          this.discardType.set('error');
          setTimeout(() => {
            this.discardMessage.set('');
            this.discardType.set('');
          }, 4000);
        } else {
          // Otros errores genéricos
          this.discardMessage.set('Ocurrió un error inesperado. Requiere mas de un producto para descarte ');
          this.discardType.set('error');
          setTimeout(() => {
            this.discardMessage.set('');
            this.discardType.set('');
          }, 4000);
        }
      }
    });
  }

  //lista Value y update

  gananciaMinimaDescarte: number = 0;
  allRules: { [key: string]: number } = {};

  inputValue: number = 0;

  loadRule(): void {
    this.ruleService.getRuleValue('GANANCIA_MINIMA_DESCARTE').subscribe({
      next: (value) => {
        this.gananciaMinimaDescarte = value;
        this.inputValue = value; // Inicializa el input con el valor actual
      },
      error: (err) => console.error('Error al cargar la regla:', err)
    });
  }

  updateRule(): void {
    if (this.inputValue === null || isNaN(this.inputValue)) return;

    this.ruleService.updateRuleValue('GANANCIA_MINIMA_DESCARTE', this.inputValue).subscribe({
      next: () => {
        this.gananciaMinimaDescarte = this.inputValue;
      },
      error: (err) => console.error('Error al actualizar la regla:', err)
    });
  }
  //Eliminaciones personalizadas
  expandedClientId: string | null = null;
  showDeleteModal = false;
  selectedClientId: string | null = null;

  openDeleteModal(clientId: string) {
    this.selectedClientId = clientId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedClientId = null;
  }

  onEliminacionContable() {
    if (!this.selectedClientId) return;

    if (confirm('¿Estás seguro de realizar la eliminación contable?')) {
      this.devolucionService.eliminacion(this.selectedClientId).subscribe({
        next: () => {
          alert('Eliminación contable realizada con éxito.');
          this.closeDeleteModal();
          this.loadClients(); // Refrescar lista
        },
        error: (err) => {
          console.error('Error en eliminación contable', err);
          alert('Error al eliminar contablemente.');
        }
      });
    }
  }

  onEliminacionDefinitiva() {
    if (!this.selectedClientId) return;

    const confirmacion = prompt(
      '⚠️ Eliminación definitiva: Todos los datos se borrarán permanentemente.\n' +
      'Escribe "confirmar" para proceder:'
    );

    if (confirmacion === 'confirmar') {
      this.devolucionService.eliminacionDefinitiva(this.selectedClientId).subscribe({
        next: () => {
          alert('Cliente eliminado definitivamente.');
          this.closeDeleteModal();
          this.loadClients(); // Refrescar lista
        },
        error: (err) => {
          console.error('Error en eliminación definitiva', err);
          alert('Error al eliminar definitivamente.');
        }
      });
    } else {
      alert('Eliminación cancelada.');
    }
  }

}
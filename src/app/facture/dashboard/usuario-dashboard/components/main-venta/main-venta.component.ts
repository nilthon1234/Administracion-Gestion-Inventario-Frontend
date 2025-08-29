import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../../../../service/sales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, TicketResponse } from '../../../../../shared/models/ticketResponse';
import { Router, RouterLink } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PagoEspecificarComponent } from '../pago-especificar/pago-especificar.component';
import { TipoPagoComponent } from '../tipo-pago/tipo-pago.component';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { DevolucionDialogComponent } from "../devolucion-dialog/devolucion-dialog.component";
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { NavBarsVentasComponent } from "../../../../../shared/components/navbars/nav-bars-ventas/nav-bars-ventas.component";
import { SizeFormatPipe } from '../../../../../shared/pipes/size-format.pipe';
import { FechaLarga } from '../../../../../shared/pipes/FechaLarga.pipe';

@Component({
  selector: 'app-main-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PayTypeTranslatePipe, CopiarTextoDirective,
    DevolucionDialogComponent, FechaLarga, CustomDateFormatPipe, NavBarsVentasComponent, SizeFormatPipe],
  templateUrl: './main-venta.component.html',
  styleUrl: './main-venta.component.css'
})
export class MainVentaComponent implements OnInit {

  hasUnspecified: boolean = false;

  constructor(private saleService: SalesService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

    //recargar
    this.cargarResumen();
    this.cargarTickets();

  }


  //resumen subtotales de dia, semana y mes

  metodosPago: any = {};

  get metodosPagoKeys(): string[] {
    return this.metodosPago ? Object.keys(this.metodosPago) : [];

  }


  resumen: any = {
    resumen: { dia: 0, semana: 0, mes: 0 },
    metodosPago: {
      Card: 0, Yape: 0, PLim: 0, Cash: 0, CashAndCard: 0
    },

    fecha: ''

  };

  fechaSeleccionada: string = this.getFechaLocal();

  getFechaLocal(): string {
    const hoy = new Date();
    const localISO = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    return localISO;
  }


  cargarResumen() {
    this.saleService.getResumen(this.fechaSeleccionada).subscribe(data => {
      // 1. Cargar el resumen general (montos, métodos de pago)
      this.resumen = {
        resumen: data.resumen,
        metodosPago: data.metodosPago,
        fecha: data.fecha
      };
      this.metodosPago = data.metodosPago; // puedes usar this.resumen.metodosPago y eliminar esta línea

      // 2. Cargar los tickets y calcular el resumen de productos al finalizar
      this.cargarTickets(() => {
        this.calcularResumenProductos(); // ✅ Ahora SÍ tienes los datos
        this.calcularConteosPendientes();
      });
    });
  }

  //FILTRO DE TICKET -> DETAILS

  tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  showModel: boolean = false;
  searchDni: string = '';

  searchType: 'dni' | 'ticket' = 'dni';
  searchValue: string = '';
  allTickets: Ticket[] = [];

  cargarTickets(completed?: () => void) {
    this.saleService.getTickets(this.fechaSeleccionada).subscribe((data: TicketResponse) => {
      const tickets = data.ticket || [];
      this.allTickets = tickets; // Guardar todos los tickets

      // Inicializar showDetails
      tickets.forEach(ticket => {
        ticket.showDetails = false;
      });

      // Aplicar filtro si hay un valor de búsqueda
      let ticketsFiltrados = tickets;
      if (this.searchValue.trim() !== '') {
        ticketsFiltrados = this.filtrarTickets(tickets, this.searchValue, this.searchType);
      }

      // Agrupar por fecha
      const grupos: { [key: string]: Ticket[] } = {};
      ticketsFiltrados.forEach(ticket => {
        const date = new Date(ticket.registrationTicket!);
        const fechaStr = date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split('/').reverse().join('-');
        if (!grupos[fechaStr]) {
          grupos[fechaStr] = [];
        }
        grupos[fechaStr].push(ticket);
      });

      // Ordenar de más reciente a más antiguo
      this.ticketsAgrupados = Object.keys(grupos)
        .map(fecha => ({
          fecha,
          tickets: grupos[fecha]
        }))
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      this.hasUnspecified = this.hasAnyUnspecifiedTicket();

      if (completed) completed();
    });
  }

  // Método para filtrar tickets
  filtrarTickets(tickets: Ticket[], valor: string, tipo: 'dni' | 'ticket'): Ticket[] {
    const valorBusqueda = valor.toLowerCase().trim();

    if (tipo === 'dni') {
      return tickets.filter(ticket =>
        ticket.dni && ticket.dni.toString().toLowerCase().includes(valorBusqueda)
      );
    } else {
      return tickets.filter(ticket =>
        ticket.nro_ticket && ticket.nro_ticket.toString().toLowerCase().includes(valorBusqueda)
      );
    }
  }
  // Cambiar tipo de búsqueda
  cambiarTipoBusqueda(tipo: 'dni' | 'ticket') {
    this.searchType = tipo;
    this.searchValue = ''; // Limpiar búsqueda al cambiar tipo
    this.cargarTickets(); // Recargar todos los tickets
  }

  // Método de búsqueda
  buscar() {
    this.cargarTickets(); // Recargar tickets con el filtro aplicado
  }

  buscarPorDni() {
    if (this.searchDni.trim() === '') {
      this.cargarTickets();
      return;
    }
    this.tickets = this.tickets.filter(ticket =>
      ticket.dni.toString().includes(this.searchDni)
    );
  }
  //Metodo para abrir el model con los detalles ticket
  mostrarDetalles(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.showModel = true;
  }

  //Metodo para cerrar modal
  cerrarModal() {
    this.showModel = false;
    this.selectedTicket = null;
  }

  getTotalTicket(): number {
    if (!this.selectedTicket || !this.selectedTicket.detail) {
      return 0;
    }
    return this.selectedTicket.detail.reduce((total, item) => total + item.sub_total, 0);
  }

  nuevaVenta() {
    console.log('Nueva Venta iniciada');
  }

  irActualizar(nroTicket: number, codToday: string, company: string, type: string, genero: string,
    size: string | null, price: number, payType: string, amount: number, producto: string) {

    const queryParams: any = {
      nroTicket: nroTicket,
      codToday: codToday,
      price: price,
      company: company,
      type: type,
      genero: genero,
      payType: payType,
      amount: amount,
      producto: producto,
    };
    if (size) {
      queryParams.size = size;
    }
    this.router.navigate(['/update-venta'], { queryParams: queryParams });

  }

  generatePdf(ticketId: number, dni: number) {
    this.saleService.generateTicketPdf(ticketId).subscribe({
      next: (pdfBlob: Blob) => {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');

        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;

        const fileName = `${dni}.pdf`.replace(/\s+/g, '');
        downloadLink.download = fileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 1000);
      },
      error: (error) => {
        console.error('Error al generar pdf', error);
        alert('Error al generar PDF');
      }
    });
  }
  //Para el boton NOESPECIFICADO
  hasUnspecifiedDetailsInList(): boolean {
    if (!this.selectedTicket || !this.selectedTicket.detail) return false;

    return this.selectedTicket.detail.some(item =>
      item.especificacion?.trim() === 'NOESPECIFICADO'
    );
  }
  hasUnspecifiedDetails(ticket: any): boolean {
    if (!ticket || !ticket.detail) return false;

    return ticket.detail.some((item: any) =>
      item.especificacion?.trim() === 'NOESPECIFICADO'
    );
  }
  tieneAumentoODescuento(ticket: any): boolean {
    if (!ticket || !ticket.detail) return false;

    return ticket.detail.some((item: any) =>
      item.discount === 'Si' || item.increase === 'Si'
    );
  }


  hasAnyUnspecifiedTicket(): boolean {
    if (!this.tickets) return false;

    return this.tickets.some(ticket =>
      ticket.detail?.some(item => item.especificacion?.trim() === 'NOESPECIFICADO')
    );
  }

  //para mostarr la cuadro de Pagos
  // Desde tu ts para abrir modal
  abrirEspecificarModal(nroTicket: number | undefined) {
    const dialogRef = this.dialog.open(PagoEspecificarComponent, {
      width: '500px',
      height: '450px',
      panelClass: 'custom-modalbox', // Aplicamos clase personalizada
      backdropClass: 'custom-backdrop', // para el fondo oscuro
      data: { nroTicket: nroTicket }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.cargarResumen();
        this.cerrarModal();
      }
    });
  }
  abrirModelTipoPago(nroTicket: number | undefined, codToday: string | undefined, id: number | undefined) {
    const dialog = this.dialog.open(TipoPagoComponent, {
      height: '450px',
      width: '450px',
      panelClass: 'custom-modalbox', // Aplicamos clase personalizada
      backdropClass: 'custom-backdrop', // para el fondo oscuro
      data: { nroTicket: nroTicket, codToday: codToday, id: id }
    });
    dialog.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.cargarResumen();
        this.cerrarModal();
      }
    });

  }
  //para alerta de audio
  private userInteracted = false;
  enableSound = () => {
    this.userInteracted = true;
    if (this.hasAnyUnspecifiedTicket()) {
      this.playAlertSound();
    }
  };

  playAlertSound(): void {
    if (!this.userInteracted) return;
    new Audio('assets/sounds/alert.mp3').play().catch(e => console.error(e));
  }
  //visualizar actualizar
  debeMostrarActualizar(item: any): boolean {
    return !(item.discount === 'Si' || item.increase === 'Si');
  }

  //para las devoluciones
  showDialog = false;
  idProducSel = 0;
  montosel = 0;

  abrirDialogoDevolucion(item: any) {
    this.idProducSel = item.id;
    this.montosel = item.sub_total
    this.showDialog = true;
  }

  cerrarDialogoDevolucio(resultado: boolean) {
    this.showDialog = false;
    if (resultado) {
      this.cargarResumen();
    }
  }
  //para el color del  contador
  getColorByContador(contador: string): string {
    switch (contador) {
      case 'ACTIVADO':
        return '#4CAF50'; // Verde
      case 'PENDIENTE':
        return '#FFC107'; // Amarillo
      case 'EN_PROCESO':
        return '#2196F3'; // Azul
      case 'ANULADO':
        return '#F44336'; // Rojo
      default:
        return '#9E9E9E'; // Gris por defecto
    }
  }

  toggleContador(ticket: Ticket): void {
    const nuevoEstado = ticket.contador === 'ACTIVADO' ? 'ANULADO' : 'ACTIVADO';

    this.saleService.updateContador(ticket.nro_ticket, nuevoEstado).subscribe(() => {
      ticket.contador = nuevoEstado;
    }, error => {
      alert('Error al actualizar el estado');
      console.error(error);
    });
  }
  //Pdf reporte Contador
  generarReportePDF(): void {
    // Convertir fechaSeleccionada (formato YYYY-MM-DD) a mes y año
    const [year, month] = this.fechaSeleccionada.split('-').map(Number);

    this.saleService.downloadSalesReport(month, year).subscribe(blob => {
      const fileName = `ventas_${month}_${year}.pdf`;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      alert('Error al generar el reporte PDF.');
      console.error(error);
    });
  }

  //Para listar por mes 
  ticketsAgrupados: { fecha: string; tickets: Ticket[] }[] = [];

  // Suponiendo que tienes todos los tickets del mes en una lista: `ticketsDelMes`
  resumenProductos: { ropa: number, calzado: number, unico: number, total: number } = {
    ropa: 0,
    calzado: 0,
    unico: 0,
    total: 0
  };

  calcularResumenProductos() {
    let ropa = 0, calzado = 0, unico = 0;

    // Recorremos los grupos y luego los tickets
    this.ticketsAgrupados.forEach(grupo => {
      grupo.tickets.forEach(ticket => {
        if (ticket.detail && Array.isArray(ticket.detail)) {
          ticket.detail.forEach(item => {
            const cantidad = item.amount || 0;
            const prod = item.producto?.trim();

            if (prod === 'ROPA') ropa += cantidad;
            else if (prod === 'CALZADO') calzado += cantidad;
            else if (prod === 'UNICO') unico += cantidad;
          });
        }
      });
    });

    this.resumenProductos = {
      ropa,
      calzado,
      unico,
      total: ropa + calzado + unico
    };
  }

  conteos = {
    noEspecificado: 0,
    aumento: 0,
    descuento: 0
  };

  calcularConteosPendientes() {
    let noEspecificado = 0;
    let aumento = 0;
    let descuento = 0;

    this.ticketsAgrupados.forEach(grupo => {
      grupo.tickets.forEach(ticket => {
        if (ticket.detail) {
          ticket.detail.forEach((item: any) => {
            if (item.especificacion?.trim() === 'NOESPECIFICADO') {
              noEspecificado++;
            }
            if (item.increase === 'Si') {
              aumento++;
            }
            if (item.discount === 'Si') {
              descuento++;
            }
          });
        }
      });
    });

    this.conteos = { noEspecificado, aumento, descuento };
  }


}

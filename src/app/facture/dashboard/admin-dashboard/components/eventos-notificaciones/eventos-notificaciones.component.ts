import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PaginatedResponse } from '../../../../../shared/models/PaginatedResponse';
import { EventNotificacionesService } from '../../../../service/event-notificaciones.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../../../../shared/pipes/highlight.pipe';
import { Notificacion } from '../../../../../shared/models/notificaciones';
import { BotonSesionTiempoComponent } from "../../../../../shared/components/button/boton-sesion-tiempo/boton-sesion-tiempo.component";

@Component({
  selector: 'app-eventos-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CustomDateFormatPipe,
    FormsModule,
    HighlightPipe,
    BotonSesionTiempoComponent
  ],
  templateUrl: './eventos-notificaciones.component.html',
  styleUrls: ['./eventos-notificaciones.component.css']
})
export class EventosNotificacionesComponent implements OnInit {

  fechaInicio: string = '';
  fechaFin: string = '';

  private noti$ = new BehaviorSubject<PaginatedResponse<Notificacion>>({
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0
  });

  filteredNotifications$: Observable<PaginatedResponse<Notificacion>>;
  currentPage = 0;
  pageSize = 10;
  filterText = '';

  constructor(private notificationService: EventNotificacionesService) {
    this.filteredNotifications$ = this.noti$.asObservable();
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.setupFilter();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.currentPage, this.pageSize).subscribe(response => {
      this.noti$.next(response);
    });
  }

  setupFilter(): void {
    this.filteredNotifications$ = combineLatest([
      this.noti$,
      this.noti$.pipe(
        startWith({
          content: [] as Notificacion[],
          pageNumber: 0,
          pageSize: this.pageSize,
          totalElements: 0,
          totalPages: 0
        }),
        map(response => response.content)
      )
    ]).pipe(
      map(([response, notifications]) => {
        if (!this.filterText) {
          return response;
        }
        const filteredContent = notifications.filter(notification =>
          notification.descripcion.toLowerCase().includes(this.filterText.toLowerCase())
        );
        return {
          ...response,
          content: filteredContent,
          totalElements: filteredContent.length
        };
      })
    );
  }



  onFilterChange(): void {
    this.currentPage = 0;
    this.setupFilter();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadNotifications();
  }

  toggleDescription(notification: any): void {
    notification.expanded = !notification.expanded;
  }

  trackById(index: number, item: any): number {
    return item.id || index;
  }

  //para el texto
  transformDescription(description: string): string {
    const wordMap = {
      'MAN': 'Hombre',
      'WOMEN': 'Mujer',
      'CHILD': 'Niño',
      'LITTLEGIRL': 'Niña',
      'BABY': 'Bebé'
    };

    let transformedDescription = description;
    (Object.keys(wordMap) as Array<keyof typeof wordMap>).forEach(key => {
      const regex = new RegExp(key, 'gi');
      transformedDescription = transformedDescription.replace(regex, wordMap[key]);
    });

    return transformedDescription;
  }



}

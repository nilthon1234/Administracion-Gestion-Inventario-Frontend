import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosNotificacionesComponent } from './eventos-notificaciones.component';

describe('EventosNotificacionesComponent', () => {
  let component: EventosNotificacionesComponent;
  let fixture: ComponentFixture<EventosNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosNotificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

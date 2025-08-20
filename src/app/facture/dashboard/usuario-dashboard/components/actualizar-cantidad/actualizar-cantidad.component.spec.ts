import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCantidadComponent } from './actualizar-cantidad.component';

describe('ActualizarCantidadComponent', () => {
  let component: ActualizarCantidadComponent;
  let fixture: ComponentFixture<ActualizarCantidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarCantidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarCantidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

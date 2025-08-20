import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoMarcasComponent } from './mantenimiento-marcas.component';

describe('MantenimientoMarcasComponent', () => {
  let component: MantenimientoMarcasComponent;
  let fixture: ComponentFixture<MantenimientoMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoMarcasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

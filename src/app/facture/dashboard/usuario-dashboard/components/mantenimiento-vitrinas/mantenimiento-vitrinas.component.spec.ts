import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoVitrinasComponent } from './mantenimiento-vitrinas.component';

describe('MantenimientoVitrinasComponent', () => {
  let component: MantenimientoVitrinasComponent;
  let fixture: ComponentFixture<MantenimientoVitrinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoVitrinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoVitrinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

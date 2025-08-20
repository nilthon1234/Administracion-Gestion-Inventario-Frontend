import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVentaSeparadaComponent } from './register-venta-separada.component';

describe('RegisterVentaSeparadaComponent', () => {
  let component: RegisterVentaSeparadaComponent;
  let fixture: ComponentFixture<RegisterVentaSeparadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterVentaSeparadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterVentaSeparadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

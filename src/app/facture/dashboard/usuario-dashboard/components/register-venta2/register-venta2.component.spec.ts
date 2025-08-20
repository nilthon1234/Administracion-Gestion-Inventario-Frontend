import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVenta2Component } from './register-venta2.component';

describe('RegisterVenta2Component', () => {
  let component: RegisterVenta2Component;
  let fixture: ComponentFixture<RegisterVenta2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterVenta2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterVenta2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

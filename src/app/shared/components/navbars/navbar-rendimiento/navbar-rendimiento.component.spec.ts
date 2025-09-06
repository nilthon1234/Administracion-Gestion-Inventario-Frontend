import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRendimientoComponent } from './navbar-rendimiento.component';

describe('NavbarRendimientoComponent', () => {
  let component: NavbarRendimientoComponent;
  let fixture: ComponentFixture<NavbarRendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarRendimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarRendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

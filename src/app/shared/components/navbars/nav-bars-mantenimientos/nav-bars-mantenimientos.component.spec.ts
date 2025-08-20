import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarsMantenimientosComponent } from './nav-bars-mantenimientos.component';

describe('NavBarsMantenimientosComponent', () => {
  let component: NavBarsMantenimientosComponent;
  let fixture: ComponentFixture<NavBarsMantenimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarsMantenimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarsMantenimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarsVentasComponent } from './nav-bars-ventas.component';

describe('NavBarsVentasComponent', () => {
  let component: NavBarsVentasComponent;
  let fixture: ComponentFixture<NavBarsVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarsVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarsVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

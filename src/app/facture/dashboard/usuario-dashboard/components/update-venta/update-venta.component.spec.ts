import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVentaComponent } from './update-venta.component';

describe('UpdateVentaComponent', () => {
  let component: UpdateVentaComponent;
  let fixture: ComponentFixture<UpdateVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

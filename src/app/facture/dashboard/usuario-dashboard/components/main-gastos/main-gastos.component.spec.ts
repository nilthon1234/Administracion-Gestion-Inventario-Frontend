import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainGastosComponent } from './main-gastos.component';

describe('MainGastosComponent', () => {
  let component: MainGastosComponent;
  let fixture: ComponentFixture<MainGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainGastosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

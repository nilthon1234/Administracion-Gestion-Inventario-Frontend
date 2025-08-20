import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainClientSeparationAmortizationComponent } from './main-client-separation-amortization.component';

describe('MainClientSeparationAmortizationComponent', () => {
  let component: MainClientSeparationAmortizationComponent;
  let fixture: ComponentFixture<MainClientSeparationAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainClientSeparationAmortizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainClientSeparationAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

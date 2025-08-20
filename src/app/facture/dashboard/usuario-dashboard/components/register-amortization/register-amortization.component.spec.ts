import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAmortizationComponent } from './register-amortization.component';

describe('RegisterAmortizationComponent', () => {
  let component: RegisterAmortizationComponent;
  let fixture: ComponentFixture<RegisterAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAmortizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

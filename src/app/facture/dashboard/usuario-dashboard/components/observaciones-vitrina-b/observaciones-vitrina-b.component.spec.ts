import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesVitrinaBComponent } from './observaciones-vitrina-b.component';

describe('ObservacionesVitrinaBComponent', () => {
  let component: ObservacionesVitrinaBComponent;
  let fixture: ComponentFixture<ObservacionesVitrinaBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservacionesVitrinaBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacionesVitrinaBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

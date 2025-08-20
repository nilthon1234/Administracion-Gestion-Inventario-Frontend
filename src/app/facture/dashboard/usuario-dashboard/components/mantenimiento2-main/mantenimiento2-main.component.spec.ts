import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mantenimiento2MainComponent } from './mantenimiento2-main.component';

describe('Mantenimiento2MainComponent', () => {
  let component: Mantenimiento2MainComponent;
  let fixture: ComponentFixture<Mantenimiento2MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mantenimiento2MainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mantenimiento2MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

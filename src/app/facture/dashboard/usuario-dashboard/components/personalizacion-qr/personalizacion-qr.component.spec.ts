import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizacionQrComponent } from './personalizacion-qr.component';

describe('PersonalizacionQrComponent', () => {
  let component: PersonalizacionQrComponent;
  let fixture: ComponentFixture<PersonalizacionQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalizacionQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalizacionQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

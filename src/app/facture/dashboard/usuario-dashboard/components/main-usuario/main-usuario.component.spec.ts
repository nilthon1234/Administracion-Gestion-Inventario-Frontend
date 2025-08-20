import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUsuarioComponent } from './main-usuario.component';

describe('MainUsuarioComponent', () => {
  let component: MainUsuarioComponent;
  let fixture: ComponentFixture<MainUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

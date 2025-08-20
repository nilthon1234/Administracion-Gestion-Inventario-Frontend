import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioConfigAppsComponent } from './usuario-config-apps.component';

describe('UsuarioConfigAppsComponent', () => {
  let component: UsuarioConfigAppsComponent;
  let fixture: ComponentFixture<UsuarioConfigAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioConfigAppsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioConfigAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

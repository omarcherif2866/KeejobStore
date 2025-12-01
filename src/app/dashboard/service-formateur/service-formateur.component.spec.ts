import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFormateurComponent } from './service-formateur.component';

describe('ServiceFormateurComponent', () => {
  let component: ServiceFormateurComponent;
  let fixture: ComponentFixture<ServiceFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

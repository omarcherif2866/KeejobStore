import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationPartnerComponent } from './formation-partner.component';

describe('FormationPartnerComponent', () => {
  let component: FormationPartnerComponent;
  let fixture: ComponentFixture<FormationPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

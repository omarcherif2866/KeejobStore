import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvLettreComponent } from './cv-lettre.component';

describe('CvLettreComponent', () => {
  let component: CvLettreComponent;
  let fixture: ComponentFixture<CvLettreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvLettreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvLettreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

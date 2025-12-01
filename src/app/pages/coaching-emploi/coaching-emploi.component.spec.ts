import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingEmploiComponent } from './coaching-emploi.component';

describe('CoachingEmploiComponent', () => {
  let component: CoachingEmploiComponent;
  let fixture: ComponentFixture<CoachingEmploiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachingEmploiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachingEmploiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

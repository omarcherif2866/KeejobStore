import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousFormationKeejobDetailsComponent } from './sous-formation-keejob-details.component';

describe('SousFormationKeejobDetailsComponent', () => {
  let component: SousFormationKeejobDetailsComponent;
  let fixture: ComponentFixture<SousFormationKeejobDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousFormationKeejobDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousFormationKeejobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

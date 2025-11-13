import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterOrganizerPage } from './register-organizer.page';

describe('RegisterOrganizerPage', () => {
  let component: RegisterOrganizerPage;
  let fixture: ComponentFixture<RegisterOrganizerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterOrganizerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

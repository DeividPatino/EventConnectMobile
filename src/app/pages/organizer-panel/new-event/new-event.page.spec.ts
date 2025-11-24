import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewEventPage } from './new-event.page';

describe('NewEventPage', () => {
  let component: NewEventPage;
  let fixture: ComponentFixture<NewEventPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

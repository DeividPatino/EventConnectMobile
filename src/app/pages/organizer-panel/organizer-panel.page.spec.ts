import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizerPanelPage } from './organizer-panel.page';

describe('OrganizerPanelPage', () => {
  let component: OrganizerPanelPage;
  let fixture: ComponentFixture<OrganizerPanelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizerPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

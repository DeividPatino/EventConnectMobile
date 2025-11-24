import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StadiumsPage } from './stadiums.page';

describe('StadiumsPage', () => {
  let component: StadiumsPage;
  let fixture: ComponentFixture<StadiumsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StadiumsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

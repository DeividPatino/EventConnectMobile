import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register3Page } from './register3.page';

describe('Register3Page', () => {
  let component: Register3Page;
  let fixture: ComponentFixture<Register3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Register3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

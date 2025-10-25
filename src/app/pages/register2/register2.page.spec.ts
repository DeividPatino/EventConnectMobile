import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register2Page } from './register2.page';

describe('Register2Page', () => {
  let component: Register2Page;
  let fixture: ComponentFixture<Register2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Register2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

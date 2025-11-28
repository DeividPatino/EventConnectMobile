import { TestBed } from '@angular/core/testing';

import { Paypal } from './paypal';

describe('Paypal', () => {
  let service: Paypal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Paypal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';

describe('Auth.registerOrganizer (minimal)', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth);
  });

  it('should reject when email or password is missing', async () => {
    const organizer = { email: '', companyName: '' } as any;
    await expectAsync(service.registerOrganizer(organizer, '')).toBeRejected();
  });
});

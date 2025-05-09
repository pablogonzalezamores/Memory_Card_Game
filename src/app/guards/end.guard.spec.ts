import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { endGuard } from './end.guard';

describe('endGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => endGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

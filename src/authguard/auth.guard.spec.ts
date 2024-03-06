// auth.guard.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../authguard/auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should allow access with a session', () => {
    const request = { session: { /* your session data */ } };
    const context: ExecutionContext = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBeTruthy();
  });

  it('should deny access without a session', () => {
    const request = { session: null };
    const context: ExecutionContext = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBeFalsy();
  });

  afterEach(async () => {
    // Additional cleanup if needed
  });
});

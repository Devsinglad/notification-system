import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    // Create a Reflector instance as required by JwtAuthGuard constructor
    const reflector = new Reflector();
    // Instantiate JwtAuthGuard with the required Reflector dependency
    expect(new JwtAuthGuard(reflector)).toBeDefined();
  });
});

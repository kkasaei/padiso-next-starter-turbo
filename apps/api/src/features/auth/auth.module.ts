import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClerkService } from './clerk.service';
import { ClerkAuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [
    ClerkService,
    // Enable auth globally - use @Public() decorator to skip auth on specific endpoints
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
  exports: [ClerkService],
})
export class AuthModule {}

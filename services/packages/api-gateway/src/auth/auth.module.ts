import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    ServicesModule, // Import ServicesModule to access UserServiceClient
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable must be set');
        }
        
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn') || '24h' as any,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard, AuthService], // Export AuthService so it can be used by other modules
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModules } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { DtoModule } from './dto/dto.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ControllersModule,
    UtilsModule,
    ConfigModules,
    AuthModule,
    DtoModule,
    // ServicesModule is imported by ControllersModule and AuthModule where needed
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],

})
export class AppModule { }





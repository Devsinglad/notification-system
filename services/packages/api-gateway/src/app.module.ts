import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModules } from './config/config.module';

@Module({
  imports: [ControllersModule, UtilsModule, ConfigModules],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}

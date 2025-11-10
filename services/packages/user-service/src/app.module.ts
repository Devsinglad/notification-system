import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ControllersModule } from './controllers/controllers.module';
import { UtilsModule } from './utils/utils.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule, ControllersModule, UtilsModule, UsersModule, PrismaModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

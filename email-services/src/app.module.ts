import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';

@Module({
  // allows the config module to be accessible globally
  imports: [ConfigModule.forRoot({ isGlobal: true }), EmailModule],
})
export class AppModule {}

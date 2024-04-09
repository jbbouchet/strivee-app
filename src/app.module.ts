import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/infrastructure/database.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true, isGlobal: true }), DatabaseModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './shared/config/typeorm.config';
import { CallsController } from './infrastructure/controllers/calls.controller';
import { CallEventsController } from './infrastructure/controllers/call-events.controller';
import { CallEventService } from './application/service/CallEventService';
import { CallsService } from './application/service/CallsService';
import { InfrastructureModule } from './infrastructure/infraestructure.module';

@Module({
  imports: [
    InfrastructureModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [CallsController, CallEventsController],
  providers: [
    CallEventService,
    CallsService,
  ],
})
export class AppModule { }

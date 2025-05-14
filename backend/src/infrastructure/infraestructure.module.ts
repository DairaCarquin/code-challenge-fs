import { Module } from "@nestjs/common";
import { CallRepository } from "./database/repository/call.repository";
import { CallEventRepository } from "./database/repository/call-event.repository";
import { CallEventRepositoryPortToken, CallRepositoryPortToken } from "src/domain/ports/tokens";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CallOrmEntity } from "./database/entities/call.orm-entity";
import { CallEventOrmEntity } from "./database/entities/call-event.orm-entity";
import { CallGateway } from "./websockets/call.gateway";

@Module({
    imports: [
        TypeOrmModule.forFeature([CallOrmEntity, CallEventOrmEntity]),],
    providers: [
        CallRepository,
        CallEventRepository,
        CallGateway,
        {
            provide: CallRepositoryPortToken,
            useClass: CallRepository,
        },
        {
            provide: CallEventRepositoryPortToken,
            useClass: CallEventRepository,
        },
    ],
    exports: [CallRepositoryPortToken, CallEventRepositoryPortToken, CallGateway],
})
export class InfrastructureModule { }
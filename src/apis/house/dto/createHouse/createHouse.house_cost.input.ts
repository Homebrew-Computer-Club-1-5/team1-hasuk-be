import { InputType, OmitType } from '@nestjs/graphql';
import { House_cost } from 'src/db_entity/house_cost/entities/house_cost.entity';
@InputType()
export class House_costInput extends OmitType(House_cost, ['id'], InputType) {}

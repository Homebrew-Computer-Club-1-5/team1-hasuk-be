import { InputType, OmitType } from '@nestjs/graphql';
import { House_cost } from 'src/apis/db_entity_crud/house_cost/entities/house_cost.entity';

export class House_costInput extends OmitType(House_cost, ['id'], InputType) {}

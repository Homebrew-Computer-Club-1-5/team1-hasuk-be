import { InputType, PickType } from '@nestjs/graphql';
import { House } from 'src/apis/db_entity_crud/house/entities/house.entity';

export class HouseInput extends PickType(
  House,
  ['contact_number', 'gender', 'house_other_info'],
  InputType,
) {}

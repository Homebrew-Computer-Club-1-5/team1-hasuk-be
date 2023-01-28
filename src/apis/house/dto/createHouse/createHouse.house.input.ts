import { InputType, PickType } from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';

@InputType()
export class HouseInput extends PickType(
  House,
  ['contact_number', 'gender', 'house_other_info'],
  InputType,
) {}

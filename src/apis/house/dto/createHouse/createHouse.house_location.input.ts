import { InputType, OmitType } from '@nestjs/graphql';
import { House_location } from 'src/db_entity/house_location/entities/house_location.entity';

@InputType()
export class House_locationInput extends OmitType(
  House_location,
  ['id'],
  InputType,
) {}

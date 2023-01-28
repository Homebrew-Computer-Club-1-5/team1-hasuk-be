import { InputType, OmitType } from '@nestjs/graphql';
import { House_location } from 'src/apis/db_entity_crud/house_location/entities/house_location.entity';

export class House_locationInput extends OmitType(
  House_location,
  ['id'],
  InputType,
) {}

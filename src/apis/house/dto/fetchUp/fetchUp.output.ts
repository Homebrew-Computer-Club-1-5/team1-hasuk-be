import {
  createUnionType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';
import { Up } from 'src/db_entity/up/entities/up.entity';

// export const FetchUpOutput = createUnionType({
//   name: 'ResultUnion',
//   types: () => [FetchUpOutput_House, FetchUpOutput_Up] as const,
// });

// @ObjectType()
// export class FetchUpOutput_Up extends Up {}

@ObjectType()
export class FetchUpOutput extends PickType(House, ['id', 'board_date']) {}

// @ObjectType()
// export class FetchUpOutput extends PickType(House, ['id', 'board_date']) {}
// export class FetchUpOutput extends Up {}

// ...on FetchUpOutput_House{
//     id
//     board_date
//   }
//          ...on FetchUpOutput_Up {
//     user_id
//     house_id
//   }

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class createHouseOutput {
  @Field(() => String)
  result: string;
}

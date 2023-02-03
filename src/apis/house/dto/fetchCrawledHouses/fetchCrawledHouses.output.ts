import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FetchCrawledHousesOutput {
  @Field(() => Int)
  id: number;

  @Field(() => [String])
  img_urls: string[];
}

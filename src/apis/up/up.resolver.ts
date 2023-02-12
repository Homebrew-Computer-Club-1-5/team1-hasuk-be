import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { ReqUser } from 'src/common/auth/gql-auth.param';
import { FetchUpOutput } from '../house/dto/fetchUp/fetchUp.output';
import { IreqUser } from '../house/house.type';
import { UpService } from './up.service';

@Resolver()
export class UpResolver {
  constructor(private readonly upService: UpService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => FetchUpOutput)
  async fetchUp(
    @ReqUser() reqUser: IreqUser,
    @Args('house_id') house_id: number,
  ) {
    return await this.upService.upHouse({ house_id, reqUser });
  }

  //   @Mutation(() => String)
  //   async test() {
  //     await this.upService.refreshUp();
  //     return 'hi';
  //   }
}

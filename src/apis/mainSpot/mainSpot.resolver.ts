import { Query, Resolver } from '@nestjs/graphql';
import { FetchMainSpotsOutput } from './dto/fetchMainSpots/fetchMainSpots.output';
import { MainSpotService } from './mainSpot.service';

@Resolver()
export class MainSpotResolver {
  constructor(private readonly mainService: MainSpotService) {}

  //모든 주요지점 가져오기
  @Query(() => [FetchMainSpotsOutput])
  fetchMainSpots() {
    return this.mainService.findAllMainSpot();
  }
}

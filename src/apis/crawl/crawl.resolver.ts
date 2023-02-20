import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CrawlService } from './crawl.service';

@Resolver()
export class CrawlResolver {
  constructor(private readonly crawlService: CrawlService) {}
  @Mutation(() => String)
  async crawl(@Args('latestBoardDateByArg') latestBoardDateByArg: number) {
    return await this.crawlService.crawl();
  }
}

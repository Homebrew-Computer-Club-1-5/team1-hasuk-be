import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CrawlService } from './crawl.service';

@Resolver()
export class CrawlResolver {
  constructor(private readonly crawlService: CrawlService) {}
  @Mutation(() => String)
  async crawlKoreaPas() {
    return await this.crawlService.crawlKoreaPas();
  }

  @Mutation(() => String)
  async crawlKoreaDormitory(
    @Args('untilYear') untilYear: number,
    @Args('untilMonth') untilMonth: number,
    @Args('untilDate') untilDate: number,
  ) {
    return await this.crawlService.crawlKoreaUniversityDormitory({
      year: untilYear,
      month: untilMonth,
      date: untilDate,
    });
  }
}

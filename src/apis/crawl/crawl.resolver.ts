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
      untilYear,
      untilMonth,
      untilDate,
    });
  }

  @Mutation(() => String)
  async crawlGumiHakSukDormitory(
    @Args('untilYear') untilYear: number,
    @Args('untilMonth') untilMonth: number,
    @Args('untilDate') untilDate: number,
  ) {
    return await this.crawlService.crawlGumiHakSukDormitory({
      untilYear,
      untilMonth,
      untilDate,
    });
  }

  @Mutation(() => String)
  async crawlNamMeoungDormitory(
    @Args('untilYear') untilYear: number,
    @Args('untilMonth') untilMonth: number,
    @Args('untilDate') untilDate: number,
  ) {
    return await this.crawlService.crawlNamMeoungDormitory({
      untilYear,
      untilMonth,
      untilDate,
    });
  }
}

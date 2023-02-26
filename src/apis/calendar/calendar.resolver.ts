import { Args, Query, Resolver } from "@nestjs/graphql";
import { Calendar } from "src/db_entity/calendar/entities/calendar.entity";
import { CalendarService } from "./calendar.service";

@Resolver()
export class CalendarResolver{
    constructor(private readonly calendarService: CalendarService){}

    @Query(() => [Calendar])
    fetchCalendar(
        @Args('month') month : number,
        @Args('dormitory_id') dormitory_id: number
    ){
        return this.calendarService.findCalendar(month, dormitory_id);
    }

}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Calendar } from "src/db_entity/calendar/entities/calendar.entity";
import { CalendarResolver } from "./calendar.resolver";
import { CalendarService } from "./calendar.service";

@Module({
    imports: [TypeOrmModule.forFeature([Calendar])],
    providers: [CalendarResolver, CalendarService],
})
export class CalendarModule{}
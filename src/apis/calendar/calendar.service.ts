import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Calendar } from "src/db_entity/calendar/entities/calendar.entity";
import { Between, LessThan, Repository } from "typeorm";


@Injectable()
export class CalendarService{
    constructor(
        @InjectRepository(Calendar)
        private readonly calendar_repository: Repository<Calendar>,
    ){}

    async findCalendar(month, dormitory_id){
        if(dormitory_id==1){
            return await this.calendar_repository.find({
                where: [{post_date : Between(
                    new Date(new Date().getFullYear(), month-1, 1), // First day of the specified month
                    new Date(new Date().getFullYear(), month, 0) // Last day of the specified month
                    )}],
                    relations: ['dormitory'],
                })
        }else{     
            return await this.calendar_repository.find({
                where: [{dormitory : {id: dormitory_id}, post_date : Between(
                    new Date(new Date().getFullYear(), month-1, 1), // First day of the specified month
                    new Date(new Date().getFullYear(), month, 0) // Last day of the specified month
                    )}],
                    relations: ['dormitory'],
                })
        }



    }

    
}
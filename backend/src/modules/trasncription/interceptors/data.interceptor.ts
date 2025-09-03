import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JWTAuthService } from 'src/modules/utils/jwt.service';
import { Response } from 'express';
import { PaginatedData } from 'src/common/types/paginateData.type';
import { Shift, Transcript } from '../schemas/transcitionSchema';
import { monthsObjet } from 'src/common/types/months';
 
@Injectable()
export class SalseDataInteceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: PaginatedData) => {
        const { data: trasncitions, numberOfPages, page } = response;

        let data = (trasncitions as any).map((shift) => {
          const createdAtAtDate = new Date(shift.createdAt);
          const updatedAtAtDate = new Date(shift.updatedAt);
         
          const durationMs =
            shift.updatedAt.getTime() - shift.createdAt.getTime();
          const durationMinutes = Math.round((durationMs / (1000 * 60)) % 60);
          const durationHours = Math.round(durationMs / (1000 * 60) / 60);
          let perforance = 0;
          let allTurns = 0;
        
          console.log(shift)
        
          return {
            _id:shift._id,
            fullName:shift.emp?shift.emp.firstName+shift.emp.lastName:'',
            duration: `${durationHours} hours ${durationMinutes} minutes`,
            endTime: `${updatedAtAtDate.getHours() - 12 > 0 ? updatedAtAtDate.getHours() - 12 + ' : ' + updatedAtAtDate.getUTCMinutes() + ' ' + 'pm' : updatedAtAtDate.getHours() + ' : ' + updatedAtAtDate.getUTCMinutes() + ' ' + 'am'}`,
            performance:shift.transcriptionsId.reduce((acc, t) => acc + (t.performance || 0), 0) /
            (shift.transcriptionsId.length || 1),
            date:
              createdAtAtDate.getDate() +
              '   ' +
              monthsObjet[createdAtAtDate.getMonth()] +
              ' ' +
              createdAtAtDate.getFullYear(),

            startTime: `${createdAtAtDate.getHours() - 12 > 0 ? createdAtAtDate.getHours() - 12 + ':' + createdAtAtDate.getUTCMinutes() + ' ' + 'pm' : createdAtAtDate.getHours() + ' : ' + createdAtAtDate.getUTCMinutes() + ' ' + 'am'}`,
          };
        });

        return {
          data,
          numberOfPages,
          page,
        };
      }),
    );
  }
}

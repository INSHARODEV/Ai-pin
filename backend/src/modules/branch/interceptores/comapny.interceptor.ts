// import { CallHandler, ExecutionContext, NestInterceptor, NestMiddleware, NotFoundException } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { CompanyService } from "src/modules/company/company.service";

// export class CompanyMiddlerware implements NestInterceptor{
//     constructor(private readonly CompanyService:CompanyService){}

//   async  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
//         const req=context.switchToHttp().getRequest()
//         const {id,
//             companyId}=req.params
                 
     
           
//         if(await   this.CompanyService.findOneBybranchAndCompanyId(companyId, id))  next.handle()  ;

//       return false
//     }
    
// }
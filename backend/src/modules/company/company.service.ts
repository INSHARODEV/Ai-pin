import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompnayRepo } from './cmopany.repo';
import { CompanyDocument } from './schemas/Cmopany.schema';
import { createUserDto } from '../users/dto/create-user-dto';
import { QueryString } from 'src/common/types/queryString.type';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
 
@Injectable()
export class CompanyService {
  constructor(private readonly comapntRepo:CompnayRepo , private  readonly logger:Logger){}
 async create(createCompanyDto: CreateCompanyDto,{role ,firstName   }:Partial<createUserDto> ) {
    this.logger.verbose(`${createCompanyDto.name} is being created at  `,CompanyService.name)
    try{
     return await this.comapntRepo.create(createCompanyDto  )
    }catch(err){
      this.logger.error(`errr to create user ${createCompanyDto}, with data ${JSON.stringify(createCompanyDto)}, stack:${err.stack}`)
      throw new InternalServerErrorException()
    }
   
  }

 async findAll({fields,limit,queryStr,skip,sort,page} :QueryString, {role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(`retrivng paginated companys by ${firstName}  . role : ${role}`)
    return  await  this.comapntRepo.find({fields,limit,queryStr,skip,sort,page}) ;
  }

  async findOne(id: string,{role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(`retrivng company   by ${firstName}  . role : ${role}`)
    return await  this.comapntRepo.findOneById(id)
  }
async findOneBybranchAndCompanyId(companyId:any, branchId:any){
  this .logger.warn(` retrinvg hte comapny assoited with this id ${companyId.slice(0,4)}... and branch id stats with  ${branchId }...`)
 return await this.comapntRepo.findOne({ _id:companyId,   branchId: { $in: [branchId] }}
   
    
  )

}
 async update(id: MongoDbId, updateCompanyDto: UpdateCompanyDto,{role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(` company id:${id} is being  updated   by  user${firstName}  . role : ${role}`)
    return await  this.comapntRepo.updateOne(id,updateCompanyDto)

  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompnayRepo } from './cmopany.repo';
 import { createUserDto } from '../users/dto/create-user-dto';
import { QueryString } from 'src/common/types/queryString.type';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
   import * as argon2 from 'argon2';
import { UsersRepo } from '../auth/auth.repo';
 
@Injectable()
export class CompanyService {
  constructor(private readonly comapntRepo:CompnayRepo, private  readonly  UsersRepo:UsersRepo,
        private  readonly logger:Logger){}
 async create(createCompanyDto: CreateCompanyDto,{role ,firstName   }:Partial<createUserDto>,
   
  ) {
 
    try{
      const hashedPassword = await argon2.hash(`changeMe`);
      let data=await this.comapntRepo.create(  createCompanyDto )
      // create a manager user
      console.log(createCompanyDto)
      const manager = await this.UsersRepo.create({
      _id:(data.manager as any)._id,
        firstName: createCompanyDto.manager.firstName,
        email: createCompanyDto.manager.email.toLocaleLowerCase(),
        password: hashedPassword,
        role: createCompanyDto.manager.role,
       

      });
   
 
  data.manager.password=undefined
   console.log(data)
     return data

    }catch(err){
      this.logger.error(`errr to create user ${createCompanyDto}, with data ${JSON.stringify(createCompanyDto)}, stack:${err.stack}`)
      throw new InternalServerErrorException()
    }
   
  }

 async findAll({fields,limit,queryStr,skip,sort,page,popultae} :QueryString, {role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(`retrivng paginated companys by ${firstName}  . role : ${role}`)
    return  await  this.comapntRepo.find({fields,limit,queryStr,skip,sort,page,popultae}) ;
  }

  async findOne(id: string,{role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(`retrivng company   by ${firstName}  . role : ${role}`)
    return await  this.comapntRepo.findOneById(id,'branchs')
  }
  async findOneNotPopulated(id: string,{role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(`retrivng company   by ${firstName}  . role : ${role}`)
    return await  this.comapntRepo.findOneById(id)
  }
async findOneBybranchAndCompanyId(companyId:any, branchId:any){
  this .logger.warn(` retrinvg hte comapny assoited with this id ${companyId.slice(0,4)}... and branch id stats with  ${branchId }...`)
 return await this.comapntRepo.findOne({ _id:companyId,  }
   
    
  )

}

 
async findByMangerId(companyId:any,  ){
 
 return await this.comapntRepo    .findOne( {"manager._id": companyId} ,'', 'branchs')
   
}
 

 
 async update(id: MongoDbId, updateCompanyDto: any,{role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(` company id:${id} is being  updated   by  user${firstName}  . role : ${role}`)
    console.log('updateCompanyDto',updateCompanyDto)
    if (updateCompanyDto.manager && updateCompanyDto.manager._id) {
      await this.UsersRepo.updateOne(updateCompanyDto.manager._id, {
        firstName: updateCompanyDto.manager.firstName,
        email: updateCompanyDto.manager.email.toLowerCase(),
      });
    }
  
    return await  this.comapntRepo.updateOne(id,updateCompanyDto)

  }

  async addBranch(id: MongoDbId, updateCompanyDto: any,{role ,firstName   }:Partial<createUserDto>) {
    this.logger.verbose(` company id:${id} is being  updated   by  user${firstName}  . role : ${role}`)
    console.log('updateCompanyDto',updateCompanyDto)
 
  
    return await  this.comapntRepo.updateOne(id,updateCompanyDto)

  }
  async remove(id: string) {
    return await this.comapntRepo.deleteOne(id)
  }
  
}

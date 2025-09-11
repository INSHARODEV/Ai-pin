import { Injectable, Logger } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { branchrepo } from './branch.repo';
import { createUserDto } from '../users/dto/create-user-dto';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import {   EmpoyeeRepo, UsersRepo } from '../auth/auth.repo';
import { Role } from 'src/shared/ROLES';
import * as argon2 from 'argon2';

@Injectable()
export class BranchService {
  constructor(
    private readonly branchrepo: branchrepo,
    private readonly employeeRepo: EmpoyeeRepo,
    private readonly logger:Logger
  ){}
  async create(createBranchDto: CreateBranchDto,{email,firstName}:Partial<createUserDto>) {
    this.logger.verbose(` user ${firstName } with email ${email} is creating ${JSON.stringify(createBranchDto)}`)
    const hashedPassword = await argon2.hash(`changeMe`);




console.log(createBranchDto)
  
    const exsistingBrnach=await  this.branchrepo.exists({name:createBranchDto.name})
    if(exsistingBrnach) {this.logger.warn(`branch already exsits `); return exsistingBrnach}

     const newBranch=  await this.branchrepo.create({name:createBranchDto.name})
      
    const superviosr = await this.employeeRepo.create({
      firstName: createBranchDto.Superviosr.firstName,
      email: createBranchDto.Superviosr.email.toLocaleLowerCase(),
      password: hashedPassword,
      role:Role.SUPERVISOR, 
    
      branchId:newBranch._id as any
      
   },
      
    )
    return newBranch
  }

  async findAll({fields,limit,page,queryStr,skip,sort,popultae},{email,firstName}:Partial<createUserDto>) {
    this.logger.verbose(` user ${firstName } with email ${email} is retriving all branches  `)
 
    return  await this.branchrepo.find({fields,limit,page,queryStr,skip,sort,popultae})
  }

  async findOne(id: string,{email,firstName}:Partial<createUserDto>) {
    this.logger.verbose(` user ${firstName } with email ${email} is retriving all branche with id: ${id}  `)
    return  await this.branchrepo.findOneById(id)
  }

  async update(id: MongoDbId, updateBranchDto: UpdateBranchDto) {
    this.logger.verbose(` user   with email   is retriving all branche with id: ${id}  `)

     return await this.branchrepo.updateOne(id,updateBranchDto)
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}

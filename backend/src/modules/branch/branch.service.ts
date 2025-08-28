import { Injectable, Logger } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { branchrepo } from './branch.repo';
import { createUserDto } from '../users/dto/create-user-dto';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';

@Injectable()
export class BranchService {
  constructor(private readonly branchrepo: branchrepo,
    private readonly logger:Logger
  ){}
  async create(createBranchDto: CreateBranchDto,{email,firstName}:Partial<createUserDto>) {
    this.logger.verbose(` user ${firstName } with email ${email} is creating ${JSON.stringify(createBranchDto)}`)
    const exsistingBrnach=await  this.branchrepo.exists({name:createBranchDto.name})
    if(exsistingBrnach) {this.logger.warn(`branch already exsits `); return exsistingBrnach}

    return  await this.branchrepo.create(createBranchDto)
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

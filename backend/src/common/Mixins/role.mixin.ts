import { CanActivate, ExecutionContext } from "@nestjs/common"
import { Observable } from "rxjs"
import { Role } from "src/shared/ROLES"
  
export const RoleMixin=(role:Role[])=>{
    return  class roleGurad implements CanActivate{
        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const req=context.switchToHttp().getRequest()
            const user=req.user
          //  console.log(user)
            if(role.some(role=>role===user.role)){
                return true
            }
            return false
        }
    }

     
}
import { CanActivate, ExecutionContext, Injectable, Query } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PermissonsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req=context.switchToHttp().getRequest()
    const {permissons}=req.user
   // console.log(req)
    const {id}=req.params
    console.log('permissons',permissons,'cmapny id',id)
    if(permissons.some(per=>per===id))    return true;

return false
  }
}

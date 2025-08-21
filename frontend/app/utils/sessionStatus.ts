import { Role } from '../../../backend/src/shared/ROLES';
  
  
export interface AUTH {
    role: Role;
    permissons: string[];
}

 
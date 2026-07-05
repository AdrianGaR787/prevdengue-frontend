import { ReportDTO, UserDTO } from './Report'; // Reutilizamos tus DTOs existentes

export interface NeighborValidation {
  idValidation: number;
  report: ReportDTO;
  validatorUser: UserDTO;
  valid: boolean;
  comments: string;
  validationDate?: string; // Opcional porque el backend lo autogenera
}
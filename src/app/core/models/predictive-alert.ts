import { DistrictDTO } from './intervention-campaign'; 
// Asume que tienes un modelo para RiskLevel, si no, puedes usar este tipo genérico:
export interface RiskLevelDTO {
  idRiskLevel: number;
  nameRiskLevel: string; // Ej: "BAJO", "MEDIO", "ALTO"
}

export interface PredictiveAlertDTO {
  idAlert: number;
  district: DistrictDTO;
  riskLevel: RiskLevelDTO;
  description: string;
  alertDate: string;
  active: boolean;
}
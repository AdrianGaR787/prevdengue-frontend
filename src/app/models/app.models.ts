// ─── Autenticación ───────────────────────────────────────────────────────────
export interface JwtRequest  { username: string; password: string; }
export interface JwtResponse { token: string; }

export interface DecodedToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

// ─── Catálogos ───────────────────────────────────────────────────────────────
export interface Role {
  idRole: number;
  nameRole: 'ADMIN' | 'CIUDADANO' | 'BRIGADISTA' | string;
  description: string;
}

export interface District {
  idDistrict: number;
  nameDistrict: string;
}

export interface HatcheryType {
  idHatcheryType: number;
  nameHatchery: string;
}

export interface ReportStatus {
  idStatus: number;
  nameStatus: string;
}

export interface RiskLevel {
  idRiskLevel: number;
  nameRiskLevel: string;
  colorRiskLevel: string;
}

export interface Symptom {
  idSymptom: number;
  nameSymptom: string;
  gravitylevel: number;
}

// ─── Usuario ──────────────────────────────────────────────────────────────────
export interface User {
  idUser: number;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  preferredLanguage: string | null;
  accumulatedPoints: number;
  biometricsActive: boolean;
  role: Role;
}

// ─── Reporte ─────────────────────────────────────────────────────────────────
export interface Report {
  idReport: number;
  description: string | null;
  latitude: number;
  longitude: number;
  isAnonymous: boolean;
  reportDate: string;
  user: Partial<User>;
  hatcheryType: Partial<HatcheryType>;
  status: Partial<ReportStatus>;
  symptoms: Partial<Symptom>[];
}

// ─── Notificación ─────────────────────────────────────────────────────────────
export interface Notification {
  idNotification: number;
  title: string;
  message: string;
  isRead: boolean;
  sendDate: string | null;
  user: Partial<User>;
}

// ─── Evento de Limpieza ──────────────────────────────────────────────────────
export interface CleaningEvent {
  idEvent: number;
  title: string;
  latitude: number;
  longitude: number;
  eventDate: string;
  status: string;
  creatorUser: Partial<User>;
}

// ─── Campaña ─────────────────────────────────────────────────────────────────
export interface InterventionCampaign {
  idCampana: number;
  tipoIntervencion: string;
  fechaInicio: string;
  fechaFin: string | null;
  district: Partial<District>;
}

// ─── Validación Vecinal ───────────────────────────────────────────────────────
export interface NeighborValidation {
  idValidation: number;
  isValid: boolean;
  comments: string | null;
  validationDate: string;
  report: Partial<Report>;
  validatorUser: Partial<User>;
}

// ─── Alerta Predictiva ───────────────────────────────────────────────────────
export interface PredictiveAlert {
  idAlert: number;
  description: string;
  alertDate: string;
  isActive: boolean;
  district: Partial<District>;
  riskLevel: Partial<RiskLevel>;
}

// ─── Queries especiales ──────────────────────────────────────────────────────
export interface FrequentSymptom {
  symptomName: string;
  count: number;
}

export interface ReportSymptomCount {
  reportId: number;
  symptomCount: number;
}

export interface CampaignByType {
  tipoIntervencion: string;
  count: number;
}
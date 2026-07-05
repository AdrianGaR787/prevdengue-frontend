export interface UserDTO {
  idUser: number;
  name: string;
  email: string;
}

export interface HatcheryTypeDTO {
  idHatcheryType: number;
  nameHatchery: string; 
}

export interface ReportStatusDTO {
  idStatus: number;
  nameStatus: string;
}

export interface ReportDTO {
  idReport: number;
  user: UserDTO;
  hatcheryType: HatcheryTypeDTO;
  status: ReportStatusDTO;
  latitude: number;
  longitude: number;
  description: string;
  reportDate: string; // Las fechas de Java (LocalDateTime) llegan como string ISO
  anonymous: boolean; // En Java los booleanos "isAnonymous" a veces se serializan como "anonymous"
}
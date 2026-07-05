// Si ya tienes un DistrictDTO en otro archivo, puedes importarlo y borrar esta interfaz.
export interface DistrictDTO {
  idDistrict: number;
  nameDistrict: string; // Asumo que así se llama tu columna de nombre de distrito
}

export interface InterventionCampaign {
  idCampana: number;
  district: DistrictDTO;
  tipoIntervencion: string; // Ej: "Fumigación", "Control Larvario"
  fechaInicio: string;      // Formato ISO de Spring Boot
  fechaFin: string;         // Formato ISO de Spring Boot
}
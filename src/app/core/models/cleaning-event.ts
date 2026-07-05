import { UserDTO } from './Report'; // 🚀 Reutilizamos tu DTO existente

export interface CleaningEvent {
  idEvent: number;
  title: string;
  creatorUser: UserDTO; // Usamos exactamente el que manda tu backend
  latitude: number;
  longitude: number;
  eventDate: string; 
  status: string;
  maxCapacity: number;
  participants: UserDTO[];
}
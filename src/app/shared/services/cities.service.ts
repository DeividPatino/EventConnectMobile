import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, DocumentData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

export interface CityZone {
  name: string;
  capacity?: number;
}

export interface CityStadium {
  name: string;
  capacity?: number;
  zones?: CityZone[];
  // Base64 string or URL for the stadium map/image if available in Firestore
  mapBase64?: string | null;
}

export interface City {
  id: string;
  name: string;
  stadiums: CityStadium[];
}

@Injectable({ providedIn: 'root' })
export class CitiesService {
  constructor(private firestore: Firestore) {}

  getCities(): Observable<City[]> {
    const ref = collection(this.firestore, 'cities');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((docs: DocumentData[]) =>
        docs.map(d => this.normalizeCity(d))
      )
    );
  }

  private normalizeCity(raw: any): City {
    // Firestore could store stadiums under different casing (e.g., Stadiums / stadiums)
    const stadiumsRaw: any[] = raw.stadiums || raw.Stadiums || [];
    const stadiums: CityStadium[] = stadiumsRaw.map(s => ({
      name: s.name || s.Name || '',
      capacity: s.capacity || s.Capacity,
      zones: (s.zones || s.Zones || []).map((z: any) => ({
        name: z.name || z.Name || '',
        capacity: z.capacity || z.Capacity,
      })),
      // normalize possible fields used in Firestore documents
      mapBase64: s.mapBase64 || s.MapBase64 || s.Map || s.map || null
    }));
    return {
      id: raw.id,
      name: raw.name || raw.Name || '',
      stadiums
    };
  }
}

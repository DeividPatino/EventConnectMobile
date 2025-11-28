
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

interface ZoneFormValue { name: string; capacity: number; }
interface StadiumPayload {
  Name: string;
  Capacity: number;
  MapBase64: string;
  Zones: { Name: string; capacity: number }[];
}

interface CityDoc {
  Name: string;
  Stadiums: StadiumPayload[];
}

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit {
  form!: FormGroup;
  cities: string[] = []; // nombres de ciudades existentes
  loading = false;
  mapPreview: string | null = null;
  maxZones = 10;
  // (Leaflet removed) no map references
  // Alert state for inline ion-alert
  alertOpen = false;
  alertHeader = '';
  alertSubHeader = '';
  alertMessage = '';
  alertButtons: any[] = ['OK'];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCities();
  }

  // lifecycle hooks: AfterViewInit/OnDestroy removed with Leaflet

  private initForm(): void {
    this.form = this.fb.group({
      city: ['', Validators.required], // puede ser nombre existente o marcador para nueva
      newCityName: [''], // visible solo si city === '__new__'
      stadiumName: ['', [Validators.required, Validators.minLength(3)]],
      stadiumCapacity: [null, [Validators.required, Validators.min(1)]],
      mapBase64: [''],
      zones: this.fb.array([])
    });

    // Revalidar zonas cuando cambia capacidad total (no mostrar alert automáticamente)
    this.form.get('stadiumCapacity')?.valueChanges.subscribe(() => {
      this.validateZonesCapacity();
    });

    // Revalidar cuando cambian las zonas (capacidad/nombres) (no mostrar alert automáticamente)
    this.zonesArray.valueChanges.subscribe(() => {
      this.validateZonesCapacity();
    });

    // Si el usuario selecciona 'Crear nueva ciudad', hacer obligatorio el campo newCityName
    this.form.get('city')?.valueChanges.subscribe((v) => {
      const newCityCtrl = this.form.get('newCityName');
      if (v === '__new__') {
        newCityCtrl?.setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        newCityCtrl?.clearValidators();
        newCityCtrl?.setValue('');
      }
      newCityCtrl?.updateValueAndValidity();
    });
  }

  // Accesores
  get zonesArray(): FormArray { return this.form.get('zones') as FormArray; }
  get isNewCity(): boolean { return this.form.get('city')?.value === '__new__'; }
  get zonesCapacitySum(): number { return this.zonesArray.controls.reduce((acc, fg) => acc + (fg.get('capacity')?.value || 0), 0); }
  get zonesFormGroups(): FormGroup[] { return this.zonesArray.controls as FormGroup[]; }

  // Nota: el botón de Guardar se mantiene activo en la UI; la validación
  // se realiza al enviar y muestra un único ion-alert cuando faltan campos.

  // Cargar ciudades existentes leyendo solo los IDs (names) de los documentos
  private async loadCities(): Promise<void> {
    try {
      const colRef = collection(this.firestore, 'cities');
      const snap = await getDocs(colRef);
      const names = snap.docs.map(d => {
        // preferir el campo Name si existe, si no usar el id del doc
        const data = d.data() as any;
        return (data && data.Name) ? String(data.Name) : d.id;
      });
      this.cities = names.sort((a, b) => a.localeCompare(b));
    } catch (e) {
      // en caso de error dejamos la lista vacía y mostramos un toast mínimo
      this.cities = [];
      await this.presentToast('Error cargando ciudades', 'danger');
    }
  }

  triggerMapPicker(): void {
    const el = document.getElementById('mapInput') as HTMLInputElement | null;
    el?.click();
  }

  uploadMap(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.readAndMaybeCompress(file).then((base64: string) => {
      this.form.patchValue({ mapBase64: base64 });
      this.mapPreview = base64;
    }).catch(() => {
      this.presentToast('Error al procesar imagen', 'danger');
    });
  }

  addZone(): void {
    if (this.zonesArray.length >= this.maxZones) return;
    this.zonesArray.push(
      this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        capacity: [null, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeZone(index: number): void {
    if (index >= 0) {
      this.zonesArray.removeAt(index);
      this.validateZonesCapacity();
    }
  }

  validateZonesCapacity(): boolean {
    // Parse values as numbers to avoid string concatenation issues from ion-input
    const totalRaw = this.form.get('stadiumCapacity')?.value;
    const total = Number(totalRaw) || 0;
    const sum = this.zonesArray.controls.reduce((acc, fg) => {
      const c = fg.get('capacity')?.value;
      return acc + (Number(c) || 0);
    }, 0);
    const valid = total > 0 && sum === total && this.zonesArray.length >= 1;
    if (this.form.get('stadiumCapacity')) {
      this.form.get('stadiumCapacity')?.setErrors(valid ? null : { mismatch: true });
    }
    return valid;
  }

  async submitForm(): Promise<void> {
    this.loading = true;
    try {
      this.form.markAllAsTouched();

      const missingReasons = this.gatherMissingReasons();
      if (missingReasons.length) {
        this.presentMissingAlert(missingReasons);
        this.loading = false;
        return;
      }

      const cityName = this.isNewCity ? (this.form.get('newCityName')?.value || '').trim() : this.form.get('city')?.value;
      if (!cityName) {
        this.loading = false;
        await this.presentToast('Nombre de ciudad requerido', 'danger');
        return;
      }

      const cityRef = doc(this.firestore, `cities/${cityName}`);
      const snapshot = await getDoc(cityRef);
      if (!snapshot.exists()) {
        const newCity: CityDoc = { Name: cityName, Stadiums: [] };
        await setDoc(cityRef, newCity);
      }

      const zonesPayload = this.zonesArray.value.map((z: ZoneFormValue) => ({ Name: z.name, capacity: Number(z.capacity) }));
      const stadium: StadiumPayload = {
        Name: this.form.get('stadiumName')?.value,
        Capacity: Number(this.form.get('stadiumCapacity')?.value),
        MapBase64: this.form.get('mapBase64')?.value || this.mapPreview || '',
        Zones: zonesPayload
      };

      // Add Location object if coordinates exist
      // No map/location: this app stores only stadium data and optional map image

      await updateDoc(cityRef, { Stadiums: arrayUnion(stadium) });
      await this.presentToast('Estadio guardado correctamente', 'success');
      this.resetForm();
    } catch (e) {
      await this.presentToast('Error guardando estadio', 'danger');
    } finally {
      this.loading = false;
    }
  }

  // Recolecta las razones por las cuales el formulario está incompleto
  private gatherMissingReasons(): string[] {
    const reasons: string[] = [];
    if (this.form.get('city')?.invalid) reasons.push('Ciudad requerida');
    if (this.isNewCity && this.form.get('newCityName')?.invalid) reasons.push('Nombre de la nueva ciudad requerido');
    if (this.form.get('stadiumName')?.invalid) reasons.push('Nombre del estadio inválido (mínimo 3 caracteres)');
    if (this.form.get('stadiumCapacity')?.invalid) reasons.push('Capacidad total inválida o faltante');
    // location fields removed; skip map-location validation
    if (!this.zonesArray.length) reasons.push('Agrega al menos una zona');
    const zonesOk = this.validateZonesCapacity();
    if (!zonesOk) reasons.push('La suma de las capacidades de las zonas debe igualar la capacidad total');
    return reasons;
  }

  private resetForm(): void {
    this.form.reset();
    this.mapPreview = null;
    while (this.zonesArray.length) this.zonesArray.removeAt(0);
    // keep marker position but clear form location if desired
  }

  // Map removed: no initMap or location helpers remain
  

  // Present inline ion-alert with list of missing reasons
  private presentMissingAlert(reasons: string[]): void {
    this.alertHeader = 'Campos incompletos';
    this.alertSubHeader = 'Corrige lo siguiente antes de continuar';
    // Use plain-text bullets; ionic alert will render newlines as separate lines
    this.alertMessage = reasons.map((r, i) => `${i + 1}. ${r}`).join('\n');
    this.alertButtons = ['OK'];
    this.alertOpen = true;
  }

  private async presentToast(message: string, color: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2200, color });
    await t.present();
  }

  // Añadido: decide si comprime según tamaño
  private readAndMaybeCompress(file: File): Promise<string> {
    const sizeKB = file.size / 1024;
    if (sizeKB < 300) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    return compressImageFile(file, 1000, 1000, 0.8);
  }
}

// Utilidad simple fuera de la clase (evitar recrear lógica) — podría moverse a servicio si se reutiliza
function compressImageFile(file: File, maxW: number, maxH: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxW / width, maxH / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject('No context'); return; }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) { reject(e); }
      };
      if (typeof reader.result === 'string') img.src = reader.result; else reject('Result not string');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

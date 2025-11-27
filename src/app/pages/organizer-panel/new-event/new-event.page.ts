// ...existing code...
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CitiesService, City, CityStadium, CityZone } from '../../../shared/services/cities.service';
import { Auth } from '../../../core/providers/auth';
import { Firestore, collection, addDoc, doc, writeBatch, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { increment, runTransaction } from 'firebase/firestore';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
  standalone: false,
})
export class NewEventPage implements OnInit {
  eventForm!: FormGroup;
  submitted = false;
  loading = false;

  categories: Record<string, string[]> = {
    musica: ['rock', 'urbano', 'pop', 'electronica'],
    deportes: ['futbol', 'baloncesto', 'tenis'],
    teatro: ['drama', 'comedia'],
    conciertos: ['sinfónico', 'festival']
  };

  footballStadiums: string[] = ['Metropolitano', 'Camp Nou', 'Wembley'];
  leagues: string[] = ['Liga Local', 'Champions', 'Copa Nacional'];

  // Dynamic data from Firestore
  cities: City[] = [];
  stadiums: CityStadium[] = [];
  zones: CityZone[] = [];

  mapPreview: string | null = null;
  imagePreview: string | null = null;
  // Wizard steps state
  currentStep = 1;
  totalSteps = 5;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private citiesService: CitiesService,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      subcategory: [''],
      cityId: ['', Validators.required],
      stadiumName: [''],
      teamLocal: [''],
      teamAway: [''],
      stadium: [''],
      league: [''],
      date: ['', Validators.required],
      address: [''],
      // basePrice removed — not needed
      imageFile: [null],
      mapFile: [null],
      zonePrices: this.fb.array([])
    });

    // Limpiar subcategoría si no aplica
    this.eventForm.get('category')?.valueChanges.subscribe(cat => {
      const subCtrl = this.eventForm.get('subcategory');
      if (!this.categories[cat]) {
        subCtrl?.setValue('');
      }
      // Si es fútbol agregamos validación requerida para ciertos campos
      const isFutbol = cat === 'deportes' && this.eventForm.get('subcategory')?.value === 'futbol';
      this.toggleFootballValidators(isFutbol);
    });

    this.eventForm.get('subcategory')?.valueChanges.subscribe(sub => {
      const cat = this.eventForm.get('category')?.value;
      const isFutbol = cat === 'deportes' && sub === 'futbol';
      this.toggleFootballValidators(isFutbol);
    });

    // Load cities from Firestore
    this.citiesService.getCities().subscribe(data => {
      this.cities = data;
    });

    // When city changes, populate stadiums and reset selections
    this.eventForm.get('cityId')?.valueChanges.subscribe(cityId => {
      const city = this.cities.find(c => c.id === cityId);
      this.stadiums = city ? city.stadiums : [];
      this.eventForm.get('stadiumName')?.setValue('');
      this.zones = [];
      // clear any previously shown stadium map when city changes
      this.mapPreview = null;
      this.clearZonePrices();
    });

    // When stadium changes, populate zones & pricing
    this.eventForm.get('stadiumName')?.valueChanges.subscribe(name => {
      const stadium = this.stadiums.find(s => s.name === name);
      this.zones = stadium?.zones || [];
      // if the stadium has a map stored in Firestore (base64 or URL), preview it
      this.mapPreview = stadium?.mapBase64 || null;
      this.buildZonePrices();
    });
  }

  // STEP (wizard) helpers
  private controlsForStep(step: number): string[] {
    switch (step) {
      case 1:
        return ['name', 'description', 'category'];
      case 2:
        // subcategory required only if available; football fields validated separately
        return ['subcategory'];
      case 3:
        return ['date', 'city', 'address'];
      case 4:
        return ['mapFile'];
      case 5:
        return ['imageFile'];
      default:
        return [];
    }
  }

  isStepValid(step: number): boolean {
    const controls = this.controlsForStep(step);
    if (controls.length === 0) return true;
    return controls.every(name => {
      const ctrl = this.eventForm.get(name);
      return !ctrl || ctrl.valid;
    });
  }

  nextStep(): void {
    this.submitted = true;
    const controls = this.controlsForStep(this.currentStep);
    // mark controls touched so validation messages show
    controls.forEach(c => this.eventForm.get(c)?.markAsTouched());
    // if current step has invalid required controls, block
    if (!this.isStepValid(this.currentStep)) {
      return;
    }
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  get subcategories(): string[] {
    const cat = this.eventForm.get('category')?.value;
    return this.categories[cat] || [];
  }

  private toggleFootballValidators(isFutbol: boolean): void {
    // 'stadium' field is selected in STEP 3 (stadiumName); do not require it here
    const footballFields = ['teamLocal', 'teamAway', 'league'];
    footballFields.forEach(f => {
      const ctrl = this.eventForm.get(f);
      if (!ctrl) return;
      if (isFutbol) {
        ctrl.addValidators(Validators.required);
      } else {
        ctrl.removeValidators(Validators.required);
        ctrl.setValue('');
      }
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  // Zone pricing helpers
  get zonePrices(): FormArray {
    return this.eventForm.get('zonePrices') as FormArray;
  }

  // Getter tipado para usar en el template y evitar TS2740
  get zoneFormGroups(): FormGroup[] {
    return this.zonePrices.controls as FormGroup[];
  }

  private clearZonePrices(): void {
    while (this.zonePrices.length) {
      this.zonePrices.removeAt(0);
    }
  }

  private buildZonePrices(): void {
    this.clearZonePrices();
    this.zones.forEach(z => {
      this.zonePrices.push(
        this.fb.group({
          zone: [z.name],
          capacity: [z.capacity],
          price: [null, [Validators.required, Validators.min(0)]]
        })
      );
    });
  }

  triggerMapPicker(): void {
    const el = document.getElementById('mapInput') as HTMLInputElement | null;
    el?.click();
  }

  triggerImagePicker(): void {
    const el = document.getElementById('imageInput') as HTMLInputElement | null;
    el?.click();
  }

  uploadMap(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    this.eventForm.patchValue({ mapFile: file || null });
    if (file) {
      this.mapPreview = URL.createObjectURL(file);
    } else {
      this.mapPreview = null;
    }
  }

  uploadImage(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    this.eventForm.patchValue({ imageFile: file || null });
    if (file) {
      this.imagePreview = URL.createObjectURL(file);
    } else {
      this.imagePreview = null;
    }
  }

  async createEvent(): Promise<void> {
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
    }
    this.loading = true;
    try {
      const payload = this.eventForm.value;
      const zonePricing = this.zonePrices.value.map((z: any) => ({
        name: z.zone,
        capacity: z.capacity,
        price: z.price
      }));
      const city = this.cities.find(c => c.id === payload.cityId);
      const stadium = this.stadiums.find(s => s.name === payload.stadiumName);
      // Obtener UID del organizador autenticado
      const organizerUser = this.auth.getUser();
      const organizerUid = organizerUser ? (organizerUser as any).uid : null;

      // Convertir archivos a Base64 (Firestore no almacena objetos File)
      const imageBase64 = payload.imageFile ? await this.fileToBase64(payload.imageFile) : null;
      // Para el mapa: priorizar el existente del estadio (mapPreview puede ser base64 o blob URL)
      let mapBase64: string | null = null;
      if (payload.mapFile) {
        mapBase64 = await this.fileToBase64(payload.mapFile);
      } else if (this.mapPreview && this.mapPreview.startsWith('data:')) {
        mapBase64 = this.mapPreview;
      } else if (stadium?.mapBase64) {
        mapBase64 = stadium.mapBase64;
      }

      // Documento principal del evento (SIN precios por zonas ni capacidades detalladas)
      const eventDoc = {
        name: payload.name,
        description: payload.description,
        category: payload.category,
        subcategory: payload.subcategory || '',
        date: payload.date, // mantener formato original (ISO / string) provisto por ion-datetime
        address: payload.address || '',
        city: city ? { id: city.id, name: city.name } : null,
        stadium: stadium ? { name: stadium.name, capacity: stadium.capacity } : null,
        image: imageBase64,
        map: mapBase64,
        organizerUid: organizerUid,
        createdAt: serverTimestamp()
      };

      // Crear documento en colección events
      const eventsCol = collection(this.firestore, 'events');
      const eventRef = await addDoc(eventsCol, eventDoc);

      // Crear subcolección zones con batch para eficiencia
      const zonesColPath = `events/${eventRef.id}/zones`;
      const batch = writeBatch(this.firestore);
      zonePricing.forEach((z: { name: string; capacity: number; price: number }) => {
        const zoneRef = doc(collection(this.firestore, zonesColPath));
        batch.set(zoneRef, {
          name: z.name,
          capacity: z.capacity,
          price: z.price,
          availableTickets: z.capacity,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();

      // Incrementar eventsCount en el documento del organizer (si existe UID)
      if (organizerUid) {
        try {
          const organizerRef = doc(this.firestore, `organizers/${organizerUid}`);
          // Usar transacción para asegurar incremento atómico y consistente
          await runTransaction(this.firestore as any, async (transaction) => {
            transaction.update(organizerRef as any, { eventsCount: increment(1) });
          });
        } catch (err) {
          console.warn('No se pudo incrementar eventsCount para organizer', organizerUid, err);
        }
      }

      // OPCIONAL: generación de tickets individuales (muy costoso si capacidad alta).
      // Toggle para generar tickets uno a uno.
      const generateIndividualTickets = false; // cambiar a true si se requiere.
      if (generateIndividualTickets) {
        await this.generateTicketsForEvent(eventRef.id, zonePricing);
      }

      console.log('Evento creado en Firestore:', eventRef.id);
      const toast = await this.toastController.create({
        message: 'Evento creado correctamente',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.eventForm.reset();
      this.imagePreview = null;
      this.mapPreview = null;
      this.submitted = false;
      this.stadiums = [];
      this.zones = [];
    } catch (e) {
      const toast = await this.toastController.create({
        message: 'Error al crear el evento',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.loading = false;
    }
  }

  // Decide if the Create button should be enabled
  canSubmit(): boolean {
    if (!this.eventForm) return false;
    if (this.loading) return false;

    // Basic required fields for any event
    const required = ['name', 'description', 'category', 'date', 'cityId'];
    const basicOk = required.every(k => {
      const c = this.eventForm.get(k);
      return !!c && c.valid;
    });
    if (!basicOk) return false;

    // Stadium selected -> zones/pricing must be valid if zones exist
    if (this.zonePrices.length > 0) {
      return this.zonePrices.controls.every(g => g.valid);
    }

    return true;
  }

  // Helper: convierte File a Base64 DataURL
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Genera tickets individuales en subcolección events/{eventId}/tickets
  private async generateTicketsForEvent(eventId: string, zonePricing: { name: string; capacity: number; price: number }[]): Promise<void> {
    // Limite de 500 operaciones por batch: dividir si excede
    for (const zone of zonePricing) {
      const zoneId = zone.name; // usar nombre como identificador lógico
      let remaining = zone.capacity;
      while (remaining > 0) {
        const batch = writeBatch(this.firestore);
        const batchCount = Math.min(remaining, 500);
        for (let i = 0; i < batchCount; i++) {
          const ticketRef = doc(collection(this.firestore, `events/${eventId}/tickets`));
          batch.set(ticketRef, {
            eventId,
            zoneId,
            price: zone.price,
            status: 'available',
            buyerUid: '',
            createdAt: serverTimestamp()
          });
        }
        await batch.commit();
        remaining -= batchCount;
      }
    }
  }

}

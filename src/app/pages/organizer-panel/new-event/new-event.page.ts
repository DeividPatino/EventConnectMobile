// ...existing code...
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CitiesService, City, CityStadium, CityZone } from '../../../shared/services/cities.service';

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
    private citiesService: CitiesService
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
      basePrice: [null, [Validators.min(0)]],
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
      this.clearZonePrices();
    });

    // When stadium changes, populate zones & pricing
    this.eventForm.get('stadiumName')?.valueChanges.subscribe(name => {
      const stadium = this.stadiums.find(s => s.name === name);
      this.zones = stadium?.zones || [];
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
        return ['basePrice', 'mapFile'];
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
    const footballFields = ['teamLocal', 'teamAway', 'stadium', 'league'];
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
      const finalEvent = {
        name: payload.name,
        description: payload.description,
        category: payload.category,
        subcategory: payload.subcategory,
        date: payload.date,
        address: payload.address,
        basePrice: payload.basePrice,
        city: city ? { id: city.id, name: city.name } : null,
        stadium: stadium ? { name: stadium.name, capacity: stadium.capacity } : null,
        zones: zonePricing,
        footballData: payload.subcategory === 'futbol' ? {
          teamLocal: payload.teamLocal,
          teamAway: payload.teamAway,
          stadium: payload.stadium,
          league: payload.league
        } : null,
        imageFile: payload.imageFile || null,
        mapFile: payload.mapFile || null
      };
      console.log('Creando evento', finalEvent);
      // Aquí integración con servicio/API.
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

}

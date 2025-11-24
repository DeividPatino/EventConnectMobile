import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: false,
})
export class EditPage implements OnInit {
  form!: FormGroup;
  stadium: any = null;
  cityName = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firestore: Firestore,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // try to get stadium from navigation state
    this.stadium = (history.state && history.state.stadium) ? history.state.stadium : null;
    this.initForm();
    if (this.stadium) {
      this.populateForm(this.stadium);
      this.cityName = this.stadium.City || '';
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      stadiumName: ['', [Validators.required, Validators.minLength(3)]],
      stadiumCapacity: [null, [Validators.required, Validators.min(1)]],
      mapBase64: [''],
      zones: this.fb.array([])
    });
  }

  get zonesArray(): FormArray { return this.form.get('zones') as FormArray; }
  get zoneGroups(): FormGroup[] { return this.zonesArray.controls as FormGroup[]; }

  private populateForm(s: any) {
    this.form.patchValue({ stadiumName: s.Name, stadiumCapacity: s.Capacity, mapBase64: s.MapBase64 || '' });
    if (Array.isArray(s.Zones)) {
      s.Zones.forEach((z: any) => {
        this.zonesArray.push(this.fb.group({ name: [z.Name, [Validators.required, Validators.minLength(2)]], capacity: [z.capacity, [Validators.required, Validators.min(1)]] }));
      });
    }
  }

  addZone(): void {
    this.zonesArray.push(this.fb.group({ name: ['', [Validators.required, Validators.minLength(2)]], capacity: [null, [Validators.required, Validators.min(1)]] }));
  }

  removeZone(i: number) { if (i >= 0) this.zonesArray.removeAt(i); }

  async save() {
    if (!this.stadium) return;
    this.form.markAllAsTouched();
    // simple validation
    const total = Number(this.form.get('stadiumCapacity')?.value) || 0;
    const sum = this.zonesArray.controls.reduce((acc, fg) => acc + (Number(fg.get('capacity')?.value) || 0), 0);
    if (total <= 0 || sum !== total) {
      await this.toastCtrl.create({ message: 'La suma de zonas debe igualar la capacidad total', duration: 2200, color: 'danger' }).then(t => t.present());
      return;
    }

    this.loading = true;
    try {
      const cityRef = doc(this.firestore, `cities/${this.cityName}`);
      const snapshot = await getDoc(cityRef);
      if (!snapshot.exists()) {
        await this.toastCtrl.create({ message: 'Ciudad no encontrada', duration: 2000, color: 'danger' }).then(t => t.present());
        return;
      }
      const data: any = snapshot.data();
      const stadiums: any[] = Array.isArray(data.Stadiums) ? data.Stadiums : [];
      // find match by Name+Capacity+MapBase64 heuristics
      const idx = stadiums.findIndex(s => s.Name === this.stadium.Name && Number(s.Capacity) === Number(this.stadium.Capacity) && (s.MapBase64 || '') === (this.stadium.MapBase64 || ''));
      if (idx < 0) {
        await this.toastCtrl.create({ message: 'Estadio original no encontrado', duration: 2000, color: 'danger' }).then(t => t.present());
        return;
      }
      const updated = {
        Name: this.form.get('stadiumName')?.value,
        Capacity: Number(this.form.get('stadiumCapacity')?.value),
        MapBase64: this.form.get('mapBase64')?.value || '',
        Zones: this.zonesArray.value.map((z: any) => ({ Name: z.name, capacity: Number(z.capacity) }))
      };
      stadiums[idx] = updated;
      await updateDoc(cityRef, { Stadiums: stadiums });
      await this.toastCtrl.create({ message: 'Estadio actualizado', duration: 2000, color: 'success' }).then(t => t.present());
      this.router.navigate(['/admin-dashboard']);
    } catch (e) {
      await this.toastCtrl.create({ message: 'Error actualizando estadio', duration: 2200, color: 'danger' }).then(t => t.present());
    } finally {
      this.loading = false;
    }
  }

  cancel() { this.router.navigate(['/admin-dashboard']); }

}

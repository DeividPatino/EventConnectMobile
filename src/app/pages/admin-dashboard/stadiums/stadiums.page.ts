import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stadiums',
  templateUrl: './stadiums.page.html',
  styleUrls: ['./stadiums.page.scss'],
  standalone: false,
})
export class StadiumsPage implements OnInit {
  stadiumTab: 'list' | 'create' | 'edit' = 'list';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Determina tab activo desde ruta hija
    const child = this.route.firstChild?.snapshot.routeConfig?.path as ('list'|'create'|'edit'|undefined);
    this.stadiumTab = child ?? 'list';
    if (child) return; // ya estamos en subruta
    // Navega a listado por defecto
    this.router.navigate(['admin-dashboard','stadiums','list']);
  }

  onSegmentChange(ev: any): void {
    const value = ev.detail?.value as ('list'|'create'|'edit');
    this.stadiumTab = value;
    this.router.navigate(['admin-dashboard','stadiums', value]);
  }
}

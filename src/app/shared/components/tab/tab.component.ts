import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { peopleOutline, calendarOutline, logOutOutline } from 'ionicons/icons';
import { Auth } from 'src/app/core/providers/auth';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  standalone: false,
})
export class TabComponent {
  @Input() activeTab: string = 'users';
  @Output() tabChange = new EventEmitter<string>();

  constructor(private readonly auth: Auth) {
    addIcons({ peopleOutline, calendarOutline, logOutOutline });
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }

  logout() {
    this.auth.logout();
  }
}
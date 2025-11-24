import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Event } from '../../../interfaces/event';
import { Zone } from '../../../interfaces/zone';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  standalone: false,
})
export class EventDetailsPage implements OnInit {
  eventId!: string;
  event: Event | undefined;
  zones: Zone[] = [];
  loadingEvent = true;
  loadingZones = true;

  constructor(private route: ActivatedRoute, private eventsService: EventsService) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId') || '';
    if (!this.eventId) {
      this.loadingEvent = false;
      this.loadingZones = false;
      return;
    }
    this.eventsService.getEvent(this.eventId).subscribe(ev => {
      this.event = ev;
      this.loadingEvent = false;
    });
    this.eventsService.getZones(this.eventId).subscribe(zs => {
      this.zones = zs;
      this.loadingZones = false;
    });
  }
}

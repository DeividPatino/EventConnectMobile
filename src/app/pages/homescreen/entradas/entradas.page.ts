import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/interfaces/ticket';
import { TicketsService } from 'src/app/shared/services/ticket.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.page.html',
  styleUrls: ['./entradas.page.scss'],
  standalone: false,
})
export class EntradasPage implements OnInit {

  tickets: Ticket[] = [];
  loading = true;

  constructor(private ticketsService: TicketsService) {}

  ngOnInit() {
    this.ticketsService.getMyTickets().subscribe({
      next: async (obs: any) => {
        obs.subscribe((res: Ticket[]) => {
          this.tickets = res;
          this.loading = false;
        });
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}

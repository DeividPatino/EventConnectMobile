import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { IMessage } from 'src/app/interfaces/message';
import { Openai } from 'src/app/shared/services/openai';
import { CustomValidators } from 'src/app/shared/services/validators/custom-validators';
import { User } from 'src/app/interfaces/user';
import { Auth } from 'src/app/core/providers/auth';


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
  standalone: false,
})
export class ChatbotPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  user!: User;
  messages: IMessage[] = [];
  promt!: FormControl;
  formChat!: FormGroup;
  loading = false;

  constructor(private readonly openaiSrv: Openai, private auth: Auth) {
    this.initForm();
  }

  ngOnInit() {
   
    const currentUser = this.auth.getUser();
    if (currentUser && 'firstName' in currentUser) {
      this.user = currentUser as User;
      this.addMessage('bot', `👋 ¡Hola ${this.user.firstName}! Bienvenido a EventBot. ¿En qué puedo ayudarte hoy?`);
    }
  }

  private initForm() {
    this.promt = new FormControl('', [
      Validators.required,
      CustomValidators.noWhiteSpace,
    ]);

    this.formChat = new FormGroup({
      promt: this.promt,
    });
  }

  addMessage(sender: 'user' | 'bot', content: string) {
    this.messages.push({ sender, content });
    this.scrollDown();
  }

  askToGpt() {
    if (!this.formChat.valid) return;

    const prompt = this.formChat.value.promt.trim();

    
    this.addMessage('user', prompt);

    this.formChat.reset();
    this.formChat.disable();
    this.loading = true;

    this.openaiSrv.senQuestion(prompt).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.formChat.enable();

        const text =
          res?.bot || ' Lo siento, no recibí respuesta del modelo.';
        this.addMessage('bot', text);
      },
      error: (err) => {
        console.error('❌ Error en la API:', err);
        this.loading = false;
        this.formChat.enable();
        this.addMessage('bot', '⚠️ Error al conectar con el servidor. Intenta más tarde.');
      },
    });
  }

  scrollDown() {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(400);
      }
    }, 100);
  }
}

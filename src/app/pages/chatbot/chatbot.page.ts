import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { IMessage } from 'src/app/interfaces/message';
import { Openai } from 'src/app/shared/services/openai';
import { CustomValidators } from 'src/app/shared/services/validators/custom-validators';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
  standalone: false,
})
export class ChatbotPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  messages: IMessage[] = [];
  promt!: FormControl;
  formChat!: FormGroup;
  loading = false;

  constructor(private readonly openaiSrv: Openai) {
    this.initForm();
  }

  ngOnInit() {}

  private initForm() {
    this.promt = new FormControl('', [Validators.required, CustomValidators.noWhiteSpace]);
    this.formChat = new FormGroup({
      promt: this.promt,
    });
  }

  askToGpt() {
    if (!this.formChat.valid) return;

    const prompt = this.formChat.value.promt as string;

    // Mensaje del usuario
    const userMsg: IMessage = { sender: 'user', content: prompt };
    this.messages.push(userMsg);

    // Mensaje del bot (vacío mientras carga)
    const botMsg: IMessage = { sender: 'bot', content: '' };
    this.messages.push(botMsg);

    this.scrollDown();
    this.formChat.reset();
    this.formChat.disable();
    this.loading = true;

    this.openaiSrv.senQuestion(prompt).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.formChat.enable();

        // ⚠️ Verificar estructura de respuesta OpenAI
        const text =
          res?.choices?.[0]?.message?.content?.trim() ||
          'No se recibió respuesta del modelo.';
        this.typeText(text);
      },
      error: (err) => {
        console.error('❌ Error en la API:', err);
        this.loading = false;
        this.formChat.enable();
        this.typeText('Error al conectar con el servidor. Intenta más tarde.');
      },
    });
  }

  typeText(text: string) {
    if (!text) return;

    let textIndex = 0;
    const messagesLastIndex = this.messages.length - 1;

    const interval = setInterval(() => {
      if (textIndex < text.length) {
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++;
      } else {
        clearInterval(interval);
        this.scrollDown();
      }
    }, 15);
  }

  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(500);
    }, 100);
  }
}

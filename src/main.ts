import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if ('serviceWorker' in navigator) {
      console.log(navigator.serviceWorker.register('firebase-messaging-sw.js'))
      return navigator.serviceWorker.register('firebase-messaging-sw.js');
    }
    return null;
  })
  .then((registration) => {
    if (registration) {
      console.log('Service Worker registrado com sucesso:', registration);
      // Pode salvar ou compartilhar isso com o Firebase, se necessário
    }
  })
  .catch((err) => console.error(err));

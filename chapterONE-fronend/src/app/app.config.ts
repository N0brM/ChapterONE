import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { LUCIDE_ICONS, LucideIconConfig } from 'lucide-angular';
import { 
  Edit2, Trash2, Settings, Plus, ArrowLeft, 
  LogOut, X, Bold, Italic, Underline, Save, PanelLeft 
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    // Adiciona esta linha para registar os ícones
    {
      provide: LUCIDE_ICONS,
      useValue: { 
        Edit2, Trash2, Settings, Plus, ArrowLeft, 
        LogOut, X, Bold, Italic, Underline, Save, PanelLeft 
      }
    }
  ],
};
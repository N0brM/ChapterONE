import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private _toasts = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this._toasts.asObservable();

  success(message: string, duration = 3500) {
    this.add('success', message, duration);
  }

  error(message: string, duration = 5000) {
    this.add('error', message, duration);
  }

  info(message: string, duration = 3500) {
    this.add('info', message, duration);
  }

  warning(message: string, duration = 4000) {
    this.add('warning', message, duration);
  }

  dismiss(id: number) {
    this._toasts.next(this._toasts.value.filter(t => t.id !== id));
  }

  private add(type: Toast['type'], message: string, duration: number) {
    const id = ++this.counter;
    this._toasts.next([...this._toasts.value, { id, type, message, duration }]);
    setTimeout(() => this.dismiss(id), duration);
  }
}

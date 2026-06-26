import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialog {
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger: boolean;
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private _dialog = new Subject<ConfirmDialog | null>();
  readonly dialog$ = this._dialog.asObservable();

  ask(
    message: string,
    options?: { confirmLabel?: string; cancelLabel?: string; danger?: boolean }
  ): Promise<boolean> {
    return new Promise(resolve => {
      this._dialog.next({
        message,
        confirmLabel: options?.confirmLabel ?? 'Confirmar',
        cancelLabel:  options?.cancelLabel  ?? 'Cancelar',
        danger:       options?.danger       ?? false,
        resolve,
      });
    });
  }

  close(result: boolean, dialog: ConfirmDialog) {
    dialog.resolve(result);
    this._dialog.next(null);
  }
}

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface CollabUser {
  userId:   number;
  username: string;
  color:    string;
}

@Injectable({ providedIn: 'root' })
export class CollaborationService {
  private hub?: signalR.HubConnection;

  readonly textReceived$ = new Subject<{ content: string; userId: number }>();
  readonly userJoined$   = new Subject<CollabUser>();
  readonly userLeft$     = new Subject<{ userId: number; username: string }>();
  readonly activeUsers$  = new Subject<CollabUser[]>();
  readonly connected$    = new Subject<boolean>();

  get isConnected(): boolean {
    return this.hub?.state === signalR.HubConnectionState.Connected;
  }

  async connect(chapterId: number, userId: number, username: string): Promise<void> {
    // Se já está ligado ao mesmo capítulo, não faz nada
    if (this.isConnected) return;

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7257/hubs/writing', {
        withCredentials: true, 
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hub.on('ReceiveTextUpdate', (content: string, userId: number) => {
      this.textReceived$.next({ content, userId });
    });

    this.hub.on('UserJoined', (user: CollabUser) => {
      this.userJoined$.next(user);
    });

    this.hub.on('UserLeft', (user: { userId: number; username: string }) => {
      this.userLeft$.next(user);
    });

    this.hub.on('ActiveUsers', (users: CollabUser[]) => {
      this.activeUsers$.next(users);
    });

    // Reconexão automática: volta a entrar no capítulo
    this.hub.onreconnected(async () => {
      this.connected$.next(true);
      await this.joinChapter(chapterId, userId, username);
    });

    this.hub.onclose(() => this.connected$.next(false));

    await this.hub.start();
    this.connected$.next(true);
    await this.joinChapter(chapterId, userId, username);
  }

  async joinChapter(chapterId: number, userId: number, username: string): Promise<void> {
    await this.hub?.invoke('JoinChapter', chapterId, userId, username);
  }

  async leaveChapter(chapterId: number): Promise<void> {
    if (this.isConnected)
      await this.hub?.invoke('LeaveChapter', chapterId);
  }

  async sendTextUpdate(chapterId: number, content: string, userId: number): Promise<void> {
    if (this.isConnected)
      await this.hub?.invoke('SendTextUpdate', chapterId, content, userId);
  }

  async disconnect(): Promise<void> {
    if (this.hub) {
      await this.hub.stop();
      this.connected$.next(false);
    }
  }
}

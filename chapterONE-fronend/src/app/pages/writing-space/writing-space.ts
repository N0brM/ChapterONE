import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-writing-space',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './writing-space.html',
  styleUrl: './writing-space.scss'
})
export class WritingSpaceComponent {}
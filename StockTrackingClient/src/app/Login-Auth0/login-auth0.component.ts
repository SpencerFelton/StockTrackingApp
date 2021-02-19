import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  templateUrl: './login-auth0.component.html'
})

export class AuthButtonComponent {
    constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
  }
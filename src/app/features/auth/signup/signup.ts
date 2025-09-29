import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service';
import { SignUpDTO } from '../../../Models/SignUpDTO';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupData: SignUpDTO = { username: '', password: '', email: '', tenant: '', workspaceName: '' };
  loading = false;
  error = '';
  success = '';
  emailValidationError = '';
  
  get isAdminUser(): boolean {
    return ['Admin1', 'Admin2', 'Admin3'].includes(this.signupData.username);
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  validateEmail(): void {
    this.emailValidationError = '';
    const email = this.signupData.email;
    if (email) {
      const atIndex = email.indexOf('@');
      const dotIndex = email.lastIndexOf('.');
      if (atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1) {
        const beforeAt = email.substring(0, atIndex);
        const afterAt = email.substring(atIndex + 1, dotIndex);
        if (beforeAt.includes(' ') || afterAt.includes(' ')) {
          this.emailValidationError = 'Email cannot contain spaces around @ or before domain';
        }
      }
    }
  }

  onSubmit(): void {
    if (!this.signupData.username || !this.signupData.password || !this.signupData.email || !this.signupData.tenant) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.signup(this.signupData).subscribe({
      next: () => {
        this.success = 'Account created successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Failed to create account. Please try again.';
        this.loading = false;
      }
    });
  }
}
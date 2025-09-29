import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: '<div class="error-page"><h2>Access Denied</h2><p>You don\'t have permission to access this resource.</p><a href="/dashboard">Return to Dashboard</a></div>',
  styles: [
    `
    :host { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: var(--light-gray); }
    .error-page { text-align: center; padding: 3rem; background: white; border-radius: var(--border-radius); box-shadow: var(--box-shadow); border: 1px solid var(--medium-gray); max-width: 500px; margin: 0 auto; }
    .error-page h2 { color: var(--danger-color); margin-bottom: 1.5rem; font-size: 2rem; }
    .error-page p { color: var(--text-color); margin-bottom: 2.5rem; font-size: 1.1rem; line-height: 1.6; }
    .error-page a { color: var(--primary-color); text-decoration: none; padding: 0.8rem 1.8rem; border: 1px solid var(--primary-color); border-radius: 6px; font-size: 1rem; transition: background-color 0.2s, color 0.2s, border-color 0.2s; font-weight: 500; }
    .error-page a:hover { background: var(--primary-color); color: white; border-color: var(--primary-hover); }
  `]
})
export class Unauthorized {}
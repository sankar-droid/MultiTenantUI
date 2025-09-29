import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user-service';
import { UserWebDetail } from '../../../Models/UserWebDTO';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail implements OnInit {
  userResponse: any = null;
  user: UserWebDetail | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getDetail(id).subscribe({
        next: (response) => {
          this.userResponse = response;
          this.user = Array.isArray(response.data) ? response.data[0] : response.data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load user details';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No user ID provided';
      this.loading = false;
    }
  }
}
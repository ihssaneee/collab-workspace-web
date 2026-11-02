import { Component, computed, inject, signal } from '@angular/core'; 
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { LucideLayoutGrid, LucideDynamicIcon } from '@lucide/angular'; 
import { NAV_ITEMS } from './nav-items'; 
import { AuthService } from '../../core/auth/auth.service'; 

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,LucideDynamicIcon, RouterLinkActive, LucideLayoutGrid],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly navItems = NAV_ITEMS;
  readonly authService = inject(AuthService);
  readonly title = 'collabWorkspace';
  

  badges = signal({ invitations: 2 }); 


  userName = computed(() => this.authService.currentUser()?.username);
  
                                           
  userInitials = computed(() => this.userName()?.charAt(0) ?? '');

  logout() {
    
  }
}

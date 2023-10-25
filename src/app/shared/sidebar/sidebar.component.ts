import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  constructor(private authService: AuthService, private router: Router){

  }

  logOut(){
    this.authService.logOut()
    .then( () => {
      this.router.navigate(['/login']);
    });
  }

}

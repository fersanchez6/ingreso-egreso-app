import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubcriptions!: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router){

  }

  ngOnInit(){
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubcriptions = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(){
    this.uiSubcriptions.unsubscribe();
  }

  loginUsuario(){
    if(this.loginForm.invalid) { return; }

    this.store.dispatch( ui.isLoading());

    /* Swal.fire({
      title: 'Espere, por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    }) */

    const {correo, password} = this.loginForm.value;
    this.authService.loginUsuario(correo, password)
      .then((credenciales: any) => {
        console.log(credenciales);
        //Swal.close();
        this.store.dispatch( ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
  }

}

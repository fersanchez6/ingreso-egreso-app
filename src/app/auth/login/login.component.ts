import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){

  }

  ngOnInit(){
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  loginUsuario(){
    if(this.loginForm.invalid) { return; }

    Swal.fire({
      title: 'Espere, por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const {correo, password} = this.loginForm.value;
    this.authService.loginUsuario(correo, password)
      .then((credenciales: any) => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch( err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
  }

}

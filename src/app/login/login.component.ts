import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup ;
  loading = false;
  returnUrl!: string ;
  submitted = false;
  loginInProgress = false;
  credentials = { phone: '', password: '' };
  message: string | undefined;
  token: string | null | undefined;
  errorMessage: string | undefined;
  showErrorMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,) {
  }
  ngOnInit(): void {
    this.initLoginForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  //  Form initalization
  //  Default params, validators
  

 initLoginForm() {
   this.loginForm = this.fb.group({
     username: ['', Validators.compose([
       Validators.required,
       Validators.minLength(2),
       Validators.maxLength(50)
     ])
     ],
     password: ['', Validators.compose([
       Validators.required,
       Validators.minLength(3),
       Validators.maxLength(100)
     ])
     ]
   });
 }
 
 login() {
  this.loginInProgress = true; 
  this.auth.login(this.credentials).subscribe(
    (response: User) => {
      if (response.role ==="Etudiant" ) {
        // Login success
        this.message = response.message;
        // Store the access token in local storage or a cookie
          localStorage.setItem('nom', response.nom);   
          localStorage.setItem('access', response.access);  
          localStorage.setItem('id', response.id.toString());   
          localStorage.setItem('access', response.access);
          localStorage.setItem('prenom', response.prenom);
          localStorage.setItem('adress', response.adress);
          localStorage.setItem('email', response.email);
          localStorage.setItem('image', response.image);
          localStorage.setItem('date_naissance', response.date_naissance);
          this.token = localStorage.getItem('access');
          // Redirect to the home page
          this.router.navigate(['/home-etudiant']);
      }else  if (response.role ==="Manager") {
        // Login success
        this.message = response.message;
        // Store the access token in local storage or a cookie
          localStorage.setItem('nom', response.nom);   
          localStorage.setItem('access', response.access);  
          localStorage.setItem('id', response.id.toString());   
          localStorage.setItem('access', response.access);
          localStorage.setItem('prenom', response.prenom);
          localStorage.setItem('adress', response.adress);
          localStorage.setItem('email', response.email);
          localStorage.setItem('image', response.image);
          localStorage.setItem('date_naissance', response.date_naissance);
          this.token = localStorage.getItem('access');
          // Redirect to the home page
          this.router.navigate(['/home-enseignant']);
      }
      else
      {
        this.message = response.message;
        this.showErrorMessage = true;
        if (this.message) {
          console.log(this.message);
          this.showErrorAlert(this.message);
        }
      }
    },
    (error) => {
      // Login error
      this.message = 'Informations invalides';
    }
  ).add(() => {
    this.loginInProgress = false; // Set to false after login completes (whether success or error)
  });
}

  submit() {
    this.login();
  }
  showErrorAlert(message: string) {
    this.errorMessage = message;
    this._snackBar.open(message, 'Fermer', {
      duration: 3000, // Durée d'affichage de l'alerte (3 secondes)
    });
  }

}

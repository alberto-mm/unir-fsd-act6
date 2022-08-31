import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  myUser: User | any;
  formName: string = '';
  buttonName: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {
    this.form = new FormGroup({
      first_name: new FormControl('', [
        Validators.required
      ]),
      last_name: new FormControl('', [
        Validators.required
      ]),
      username: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,7}$/)
      ]),
      image: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      repeatPassword: new FormControl('', []),
    }, [this.checkPassword])
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {
      // Se comprueba la ruta para definir si se quiere actualizar o crear un usuario
      if (params.iduser !== undefined) {
        // Si se quiere actualizar, se obtienen los datos del usuario
        let id: number = parseInt(params.iduser);
        try {
          let response = await this.usersService.getById(id);
          this.myUser = response;
          this.form.patchValue({
            first_name: this.myUser.first_name,
            last_name: this.myUser.last_name,
            username: this.myUser.username,
            email: this.myUser.email,
            image: this.myUser.image
          });
          this.formName = 'ACTUALIZAR USUARIO';
          this.buttonName = 'Actualizar';
        } catch(err) {
          console.log(err);
        }
      } else {
        // Crear nuevo usuario
        this.formName = 'NUEVO USUARIO';
        this.buttonName = 'Guardar';
      }
    });
  }

  async getDataForm() {
    if (this.form.valid) {
      /* TO DO
      - HACER EL ENVÍO DE DATOS A LA API PARA ACTUALIZAR UN USUARIO (PUT)
      - INFORMAR DE LA RESPUESTA DE LA API (OK o KO)
      - REDIRIGIR AL LISTADO
      */

      // La propiedad repeatPassword no es necesaria, por lo que habrá que asignar cada una de las propiedades del objeto
      let newUser: User = {
        'first_name': this.form.value.first_name,
        'last_name': this.form.value.last_name,
        'username': this.form.value.username,
        'email': this.form.value.email,
        'image': this.form.value.image,
        'password': this.form.value.password
      }

      try {
        let response = await this.usersService.create(newUser);
        // Si se devuelven los datos del usuario añadiendo el id, se considera como correcta la insercción aunque no se visualice
        if (response.id) {
          alert('El ususario ha sido creado correctamente');
          this.router.navigate(['/home']);
        } else {
          alert('Ha ocurrido un error. Por favor, inténtalo de nuevo');
        }
      } catch(err) {
        console.log(err);
      }
    } else {
      alert('¡Hay campos del formulario incorrectos!');
    }
  }

  checkControl(pControlName: string, pError: string): boolean {
    if (this.form.get(pControlName)?.hasError(pError) && this.form.get(pControlName)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  checkPassword(pFormValue: AbstractControl) {
    const password: string = pFormValue.get('password')?.value;
    const repeatPassword: string = pFormValue.get('repeatPassword')?.value;
    if (password !== repeatPassword) {
      return { 'checkpassword': true }
    } else {
      return null
    }
  }

}

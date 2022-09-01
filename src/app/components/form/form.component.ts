import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  myUser: User | any;
  formName: string = 'NUEVO USUARIO';
  buttonName: string = 'Guardar';

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
      // Se comprueba la ruta para definir si se quiere actualizar un usuario
      if (params.iduser !== undefined) {
        let id: number = parseInt(params.iduser);
        this.formName = 'ACTUALIZAR USUARIO';
        this.buttonName = 'Actualizar';
        // Como se quiere actualizar, se obtienen los datos del usuario
        try {
          let response = await this.usersService.getById(id);
          this.myUser = response;
          // Se actualizan los valores de cada campo del formulario para mostrar la info del usuario
          this.form = new FormGroup({
            first_name: new FormControl(this.myUser?.first_name, [
              Validators.required
            ]),
            last_name: new FormControl(this.myUser?.last_name, [
              Validators.required
            ]),
            username: new FormControl(this.myUser?.username, [
              Validators.required
            ]),
            email: new FormControl(this.myUser?.email, [
              Validators.required,
              Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,7}$/)
            ]),
            image: new FormControl(this.myUser?.image, [
              Validators.required
            ]),
            password: new FormControl('', [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(16)
            ]),
            repeatPassword: new FormControl('', []),
            id: new FormControl(this.myUser?.id, [])
          }, [this.checkPassword])
        } catch(err) {
          console.log(err);
        }
      }
    });
  }

  async getDataForm() {
    if (this.form.valid) {
      // La propiedad repeatPassword ya no es necesaria, por lo que se elimina
      delete this.form.value.repeatPassword;
      let newUser: User = this.form.value;

      if (newUser.id) {
        // Se está actualizando un usuario
        try {
          let response = await this.usersService.update(newUser);
          // Si se devuelven todos los datos del usuario, se considera como correcta la actualización aunque no se visualice
          // Se comprueba que exista el id en la respuesta
          if (response.id) {
            Swal.fire({
              icon: 'success',
              title: 'El usuario ha sido actualizado correctamente'
            });
            this.router.navigate(['/home']);
          } else {
            // Si ocurre un error, se usa el mensaje de error recibido en la respuesta de la API
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error',
              text: response.error
            });
          }
        } catch(err) {
          console.log(err);
        }
      } else {
        // Se está creando un nuevo usuario
        try {
          let response = await this.usersService.create(newUser);
          // Si se devuelven los datos del usuario añadiendo el id, se considera como correcta la insercción aunque no se visualice
          if (response.id) {
            Swal.fire({
              icon: 'success',
              title: 'El usuario ha sido creado correctamente'
            });
            this.router.navigate(['/home']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error',
              text: 'Por favor, inténtelo de nuevo'
            });
          }
        } catch(err) {
          console.log(err);
        }
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: '¡Hay campos del formulario incorrectos!'
      });
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

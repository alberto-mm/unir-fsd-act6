import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  myUser: User | any;

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {
      let id: number = parseInt(params.iduser);
      try {
        let response = await this.usersService.getById(id);
        this.myUser = response;
      } catch(err) {
        console.log(err);
      }
    });
  }

  deleteUser(pId: number | undefined): void {
    if (pId !== undefined) {
      Swal.fire({
        icon: 'question',
        title: `¿Estás seguro de que deseas borrar a ${this.myUser.first_name} ${this.myUser.last_name}?`,
        showDenyButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          //Se borra el usuario
          try {
            let response = await this.usersService.delete(pId);
            // Si se devuelven todos los datos del usuario, se considera como correcto el borrado aunque no se visualice
            // Se comprueba que exista el id en la respuesta
            if (response.id) {
              Swal.fire({
                icon: 'success',
                title: 'El usuario ha sido borrado correctamente'
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
        }
      });
    }
  }

}

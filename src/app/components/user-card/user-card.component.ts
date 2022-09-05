import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() myUser!: User;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
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

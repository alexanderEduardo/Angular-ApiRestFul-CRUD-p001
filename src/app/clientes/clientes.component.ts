import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[]=[];  //this.clientes;


  /*private clienteService:ClienteService;*/
 /* constructor(clienteService:ClienteService) {
    this.clienteService=clienteService;
   }*/

   constructor(private clienteService:ClienteService){

    //this.clientes = this.clienteService.getClientes();
   }


  // Este evento es cuando se inicializa el componente
  //Aca cada vez que detecte cambios en el bd se actualiza e invoca el metodo 
  ngOnInit(): void {
     this.clienteService.getClientes().subscribe(
        clientes => {this.clientes = clientes;
         console.warn("getClientes() 200");} //no es necesario un return puede ser void 
     );
  }

  delete(cliente : Cliente) : void {
     swal({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si elimina !',
      cancelButtonText: 'No cancelar'
    }).then((result) => {
      if (result.value) {
         this.clienteService.delete(cliente.id).subscribe(
            res => {
               this.clientes=this.clientes.filter(c => c != cliente);
               swal(
                  'Cliente Eliminado!',
                  `El cliente ${cliente.nombre} ha sido eliminado con exito`,
                  'success'
                )
            }
         );
         
      }
    })
  }


  deleteAll() : void{
         swal({
            title: 'Esta seguro?',
            text: `¿Seguro que desea eliminar a Todos los Clientes?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '¡Si eliminar!',
            cancelButtonText: '¡No cancelar!'
          }).then((result) => {
            if (result.value) {
               this.clienteService.deleteAll().subscribe(
                  res =>{
                     console.warn(res);
                     this.clientes=res;
                     swal(
                        'Clientes eliminados',
                        `Todos los clientes han sido eliminados con exito`,
                        'success'
                      )
                  }
               );
            }
          });
        }

  modify() : void {
      this.clientes=this.clientes.filter(c=>c.nombre!="Sean");
  }

}

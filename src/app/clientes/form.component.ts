import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router,ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente:Cliente = new Cliente();
  titulo:string = "#Crear Cliente#";
  public errores:string[]=[];
  constructor(private clienteService:ClienteService,private router:Router,private activeRoute:ActivatedRoute) {
    
   }

  ngOnInit(): void {
    let i=1;
    console.log(this.cliente);
    if(this.router.url !== "/clientes/form"){
    console.log("charge client");
    this.titulo="{Editar Cliente}";
    this.cargarCliente();
    //Sino pongo este timeout no muestra el valor real de cliente ya que tiene que esperar la promesa del metodo()
    setTimeout(() =>{
      console.log(this.cliente);
    }, 1000);
    }
  }

  public create(): void{
    console.log("before subscribing",this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      {
        next: (res) => {
          console.log("subscribing",res);
          this.router.navigate(['/clientes']); // El return no es necesario
          swal("Nuevo Cliente",`Cliente ${this.cliente.nombre} creado con exito`,"success");
      },
        error: err => {
          this.errores = err.error.errors as string[]; // Aca errors hace referencia a la lista que se pasa en spring 
          console.error("status desde spring : ".concat(err?.status));
          console.error(err.error);
          this.errores=err.error;
          console.error("obj http error de spring",err);
        }
      })
  }


  cargarCliente() : void {
    this.activeRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(res=>this.cliente=res);
      }
    })
  }

  updateCliente() : void {
    this.clienteService.update(this.cliente).subscribe(
      {
        next:(res)=>{
          this.router.navigate(['/clientes']);
          console.log(res);
          swal("Cliente Actualizado con Exito",`El Cliente ${res.cliente.nombre} ha sido actualizado con exito`,"success");
        },
        error:(err)=>{
          this.errores = err.error.errorsBR as string[]; // Aca errors hace referencia a la lista que se pasa en spring 
          console.error("status desde spring : ".concat(err?.status));
          console.error(err.error.errorsBR);
          console.error("obj http error de spring",err);
        }
      }
    );
  }

/*  res => {this.router.navigate(['/clientes']);
  console.log(res);
   swal("Cliente Actualizado con Exito",`El Cliente ${res.cliente.nombre} ha sido actualizado con exito`,"success");
},
err => {
this.errores = err.error.errors as string[]; // Aca errors hace referencia a la lista que se pasa en spring 
console.error("status desde spring : ".concat(err?.status));
console.error(err.error.errorsBR);
console.error("obj http error de spring",err);
}*/


  /*public create_Void() : void {
    console.log("createVoid()",this.cliente);
    this.clienteService.createVoid(this.cliente);
    this.router.navigate(['/clientes']);
  }*/

}

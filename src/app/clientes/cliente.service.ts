import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { formatDate,DatePipe } from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Observable,throwError } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { map,catchError,tap } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(private http:HttpClient,private router:Router) { }
  
  private urlEndPoint : string = "http://localhost:8090/api/clientes";
  private httpHeaders : HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  //Basicamente implemento Observable para que a la hora de hacer peticiones rest la bd se actuliza 
  //y nuestro cliebnte tmb se actualiza mediante este patronde  diseño

  //Version estatica
  /* getClientes() :Observable< Cliente[] >{
    console.log(typeof of(CLIENTES));
    return of(CLIENTES);
  }*/

  //Version remota usando nuestro api rest desde Spring
  // http.get siempre va retorna una variable de tipo Observable<Object>
  // Por lo tanto dentro de la promesa en el body de respuesta va devolver un obj de tipo .json por defecto sin tipo "any"
  getClientes() : Observable<Cliente[]>{
    /*return this.http.get<Cliente[]>(this.urlEndPoint).pipe(
      map( (res) => {
        res.map((c)=>c.nombre=c.nombre.toUpperCase())
        return res;
      })
    );  */
    return this.http.get(this.urlEndPoint).pipe(
      tap(res =>{
        console.log('tap 1');
        let clientes = res as Cliente[]; //aca tengo que convertir ya que res es de tipo Object 
        clientes.forEach( c => console.log(c.nombre))
      }),
      map( response => {
        let clientes=response as Cliente[];
        return clientes.map( c=>{
          c.nombre = c.nombre.toUpperCase();
          
          let datePipe=new DatePipe('es');
          //c.createAt= formatDate(c.createAt,'EEEE dd, MMMM yyyy','en-US');
          //c.createAt = datePipe.transform(c.createAt,'fullDate')|| c.createAt;
          return c;
        })
      }),
      tap(res =>{ //aca el res ya es de tipo cliente por el map
        console.log('tap 2');
        res.forEach( c => console.log(c.nombre))
      })
      //map( function(res) { return res as Cliente[]})
    );
  }

  create(cliente:Cliente) : Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
      catchError( e => {
        
        if(e.status == 400){
          return throwError(()=>{return e});
        }
        // ya no ejecuta a apartir de line 73 porque el status error va ser 400 siempre ya que tenemos en
        // spring todas las validaciones con anotaciones por ende la unica manera de que pase esta linea es 
        //que ocurra un error (sql exception ) que no sea leido por el BindingResult de Spring   
        swal("Error al crear el cliente",e.error.message,"error");
        return throwError(()=>e);
      })
    );
  }

  getCliente(id:number) : Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.message);
        console.warn(e); // e == throwError
        swal("Error al editar!",e.error.message,"error");
        return throwError( () => e );
      })
      );
    }
    
    update(cliente:Cliente) : Observable<any>{
      return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
        catchError(e => {
          
          if(e.status == 400){
            return throwError(()=>e);
          }

          swal("Error al actualizar el cliente",e.error.message,"error");
          return throwError(()=>e);
        })
      );
    }
    
  delete(id:number) : Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError( e => {
        if(e.status == 500){
          return throwError(()=>{return e});
        }
        //No llega a esta linea ya que spring me devuelve solo status 500 en caso de error
        swal("Error al eliminar",e.error.message,"error");
        return throwError( () => e );
      }
      )
    )
  }

  deleteAll() : Observable<Cliente[]>{
    return this.http.delete<Cliente[]>(`${this.urlEndPoint}/delAll`,{headers:this.httpHeaders});
  }

  /*createVoid(cliente:Cliente) : void {
    this.http.post(this.urlEndPoint,cliente,{headers:this.httpHeaders});
  }*/


}

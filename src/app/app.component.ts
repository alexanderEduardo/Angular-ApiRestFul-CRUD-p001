import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { //Se pone export para que se puede importar desde app.module.ts
  title = 'Bienvenido a Angular';
  curso:string = 'Curso Spring con Angular :)';
  user:string = 'Alexander Eduardo';
 /*  getName():void{
    console.log("Hello World");
  } */
}

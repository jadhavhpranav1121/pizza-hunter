import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-modal-signup',
  templateUrl: './modal-signup.component.html',
  styleUrls: ['./modal-signup.component.css']
})
export class ModalSignupComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    
  }
  closetoggle(){
    this.router.navigate(['']);
  }
}
import pets from "./data/data.js"
const { createApp } = Vue

createApp({
    data() {
      return {
        password:'',
        username:'',
        successfullLogin:false,
        data:[],
        user:null, //Si genera errores dejarlo con las llaves
        activity:'adoptar',
        pets:[],
      }
    },
    methods:{
      login(){
        const user=this.data.find(user=>user.login.username===this.username && user.login.password===this.password)
        if(!user){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario o contraseña ingresados son incorrectos',
          })
          return
        }
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Ingreso Exitoso',
          showConfirmButton: false,
          timer: 1500
        })
       
        //Esto es para mantener el login en caso de recargar la página.
        this.user=user
        this.successfullLogin=true
        localStorage.setItem("successfullLogin",this.successfullLogin)
        localStorage.setItem("user",JSON.stringify(user))

      },
      logout(){
        this.successfullLogin=false
        localStorage.setItem("successfullLogin",this.successfullLogin)
        this.password=''
        this.username=''
        this.user=null
        localStorage.removeItem("user")
      },
      adopt(e){
        Swal.fire({
          title: `Estás seguro de querer adoptar a ${this.pets[e.target.id].name} ?` ,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Adoptar',
          denyButtonText: `No estoy interesado`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            //TODO: actualizar el estado de la mascota que se adoptó.
            this.pets[e.target.id].state='adopted'
            localStorage.setItem("pets",JSON.stringify(this.pets))
            Swal.fire(`Felicidades, ahora ${this.pets[e.target.id].name} es tu mascota!`, '', 'success')
          } else if (result.isDenied) {
            Swal.fire('En otra ocación será, tal vez podrías estar interesado en algún otro miembro de nuestra familia', '', 'info')
          }
        })
      },
      async getUsers(){
          const data= await fetch('https://randomuser.me/api/?results=20')
          const {results}=await data.json()

          this.data=  results
          console.log('username-Admin: '+this.data[0].login.username)
          console.log('password-Admin: '+this.data[0].login.password)
          console.log('username-user: '+this.data[3].login.username)
          console.log('password-user: '+this.data[3].login.password)
          //Voy a poner a los tres primeros usuarios como administradores y a los demás como normales.
          for(let i=0; i<this.data.length;i++){
            if(i<3){
              this.data[i].userType='admin'
            }else{
              this.data[i].userType='user'
            } 
          }
          
          localStorage.setItem("users",JSON.stringify(this.data))
      },
    },
    computed:{
      getFullName(){
        return `${this.user.name.first} ${this.user.name.last}`
      },
      getPhoto(){
        return `${this.user.picture.thumbnail}`
      },
      getTypeUser(){
        return (this.user.userType==='admin') //Retorna true si el usuario es del tipo administrador
      },
      
    },
    created(){
      //LocalStorage para los usuarios
      if(JSON.parse(localStorage.getItem("users"))){
        this.data=JSON.parse(localStorage.getItem("users"))
        console.log('username-admin: '+this.data[0].login.username)
        console.log('password-admin: '+this.data[0].login.password)
        console.log('username-user: '+this.data[3].login.username)
        console.log('password-user: '+this.data[3].login.password)
      }else{
        this.getUsers()
    
      }
      
      //LocalStorage para el login
      if(localStorage.getItem("successfullLogin")!==null){
        this.successfullLogin=(localStorage.getItem("successfullLogin")==="true")?true:false
      }else{
        this.successfullLogin=false
      }

      //Local Storage para usuario logeado
      if(JSON.parse(localStorage.getItem("user"))){
        this.user=JSON.parse(localStorage.getItem("user"))
      }
      //Local Storage para mascotas.
      if(JSON.parse(localStorage.getItem("pets"))){
        this.pets=JSON.parse(localStorage.getItem("pets"))
      }else{
        this.pets=pets  //Pets de la data importada
        localStorage.setItem("pets",JSON.stringify(this.pets))
      }
    }
  }).mount('#app')
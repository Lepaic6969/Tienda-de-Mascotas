import pets from "./data/data.js"
const { createApp } = Vue

createApp({
    data() {
      return {
        password:'',
        username:'',
        successfullLogin:false,
        data:[],
        user:null, 
        activity:'adoptar',
        pets:[],
        //Variables de formulario de dar en adopción.
        name:'',
        genre:'',
        species: '',
        race:'',
        age:'',
        description:'',
        img:'',
        //Variables de validación del formulario de registro de mascotas.
        nameOk:true,
        genreOk:true,
        speciesOk:true,
        raceOk:true,
        ageOk:true,
        agePositiveOk:true,
        descriptionOk:true,
        imgOk:true
        

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
        this.activity='adoptar'
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
      closeModal(){
        const myModalEl = document.getElementById('exampleModal');
        const modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
      },
      selectImage(e){
        this.img=`${e.target.getAttribute("src")}`,
        this.closeModal()

      },
      resetValidation(){
        this.nameOk=true
        this.genreOk=true
        this.speciesOk=true
        this.raceOk=true
        this.ageOk=true
        this.agePositiveOk=true
        this.descriptionOk=true
        this.imgOk=true
      },
      resetForm(){
        this.name=''
        this.genre=''
        this.species=''
        this.race=''
        this.age=''
        this.description=''
        this.img=''
      },
      validateData(){
        let flag=true
        this.resetValidation()
        if(this.name===''){
          this.nameOk=false
          flag=false
        }
        if(this.genre===''){
          this.genreOk=false
          flag=false
        }
        if(this.species===''){
          this.speciesOk=false
          flag=false
        }
        if(this.race===''){
          this.raceOk=false
          flag=false
        }
        if(this.age===''){
          this.ageOk=false
          flag=false
        }
        if(this.age!=='' && this.age<=0){
          this.agePositiveOk=false
          flag=false
        }
        if(this.description===''){
          this.descriptionOk=false
          flag=false
        }
        if(this.img===''){
          this.imgOk=false
          flag=false
        }
        
        return flag
      },
      registerPet(){
        let correctData=this.validateData()
        if(!correctData){
          return
        }
        const newPet={
          photo:this.img,
          name:this.name,
          genre:this.genre,
          species:this.species,
          race:this.race,
          age:`${this.age} meses`,
          description:this.description,
          state:'available' //Estado por defecto
        }
        this.pets.push(newPet)
        localStorage.setItem("pets",JSON.stringify(this.pets))

        //TODO: Hay que encargarnos de resetear bien el formulario.
        this.resetForm()
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro de mascota exitoso',
          showConfirmButton: false,
          timer: 1500
        })

      }
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
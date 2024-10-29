export default{
    template:
        `
        <div id="app" class="container mt-5" >
            <div class="row justify-content-center login-container" style="margin-top: 12%;">
                <div class="col-md-3">
                    <div class="login-form" style="background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                        <h2 class="text-center mb-4">Admin Login</h2>
                        <div v-if="error" class="alert alert-danger mt-3" role="alert">
                            {{error }}
                        </div>
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email" v-model="credentials.email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" v-model="credentials.password" required>
                            </div>
                            <button type="submit" class="btn btn-block login-btn" style="background-color: #dc3545; color: #fff;">Login</button>
                        </form>
                        Don't have an account? <router-link to="/signup">Sign Up</router-link> <br>
                        Log in as Reader?   <router-link to="/">User login</router-link>
                    </div>
                </div>
            </div>
        </div>

        `,
        data() {
            return {
                credentials:{
                    email: null,
                    password: null,
                },
                error:null
            };
          },
        methods: {
            async login() {
                const response = await fetch('/login-admin',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(this.credentials),
                })
                const out = await response.json()
                if (response.ok){
                    localStorage.setItem('auth-token',out.token)
                    localStorage.setItem('role',out.role)
                    localStorage.setItem('username',out.username)
                    this.$router.push({path:'/dashboard'})
                    this.credentials.email=null
                    this.credentials.password=null
                }else{
                    this.error = out.error
                    this.credentials.email=null
                    this.credentials.password=null
                }
            }
        },
        mounted(){
            if(localStorage.getItem("auth-token")){
                if(localStorage.getItem('role') === 'admin'){
                    this.$router.push({path:'/dashboard'})
                }
                if(localStorage.getItem('role')  === 'user'){
                    this.$router.push({path:'/user-dashboard'})
                }
            }
        }
}
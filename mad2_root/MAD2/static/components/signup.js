export default {
    template: `
    <div id="signup" class="container mt-5">
        <div class="row justify-content-center login-container" style="margin-top: 12%;">
            <div class="col-md-3">
                <div class="signup-form" style="background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                    <h2 class="text-center mb-4">Sign Up</h2>
                    <form @submit.prevent="signup">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" v-model="credentials.username" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" v-model="credentials.email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" v-model="credentials.password" required>
                        </div>
                        <button type="submit" class="btn btn-block signup-btn" style="background-color: #dc3545; color: #fff;">Sign Up</button><br>
                        Have an account? <router-link to="/login">Login</router-link> <br>
                        Log in as Librarian?   <router-link to="/admin-login">Admin login</router-link>
                    </form>
                </div>
            </div>
        </div>
    </div>
`,
    data() {
        return {
            credentials:{
                username: null,
                email: null,
                password: null,
            },
            error:null
        };
    },
    methods: {
        async signup() {
            const response = await fetch('/signup',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(this.credentials),
            })
            const out = await response.json()
            if (response.ok){
                this.$router.push({path:'/'})
                this.credentials.username=null
                this.credentials.email=null
                this.credentials.password=null
            }else{
                this.error = out.message
                this.credentials.username=null
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

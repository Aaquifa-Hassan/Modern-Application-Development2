import user_nav from "./user_nav.js"
import user_display from "./user_display.js"

export default{
    components:{
        user_nav,
        user_display
    },
    template:`
        <div>
            <user_nav></user_nav>
            <user_display></user_display>
        </div>`,
    mounted(){
        if(localStorage.getItem("auth-token")){
            if(localStorage.getItem('role') === 'user'){
                this.$router.push({path:'/user-dashboard'})
            }
            else{
                this.$router.push({path:'/'})
            }
        }
    }
}
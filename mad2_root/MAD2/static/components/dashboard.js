import admin_nav from "./admin_nav.js"
import admin_display from "./admin_display.js"

export default{
    components:{
        admin_nav,
        admin_display
    },
    template:`
        <div>
            <admin_nav></admin_nav>
            <admin_display></admin_display>
        </div>`,
    mounted(){
        if(localStorage.getItem("auth-token")){
            if(localStorage.getItem('role') === 'admin'){
                this.$router.push({path:'/dashboard'})
            }
            else{
                this.$router.push({path:'/'})
            }
        }
    }
}
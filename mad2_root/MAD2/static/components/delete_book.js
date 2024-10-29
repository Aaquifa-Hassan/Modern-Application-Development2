import admin_nav from "./admin_nav.js";

export default{
    components:{
        admin_nav
    },
    template:`
    <div>
        <admin_nav></admin_nav>
        <div v-if="!deleted" class="container" style="margin-top: 12%;">
        <div class="add-book-box">
          <h2 style="text-align: center; color: #333;">Change book {{ book_name }}</h2>

          <p v-if="error && !success_message" class="alert alert-danger mt-3" role="alert" style="text-align:center">{{ error }}</p>
          <p v-if="success_message" class="alert alert-success mt-3" role="alert" style="text-align:center">{{ success_message }}</p>

          <form @submit.prevent="Delete" style="margin-left:18%" >
            <strong style="color:red;font-size:25px;">Are you sure you want to delete this book?</strong>
            <br>
            <button type="submit" class="btn btn-primary">Delete Book</button>
            <router-link style="margin-left:1%" class="btn btn-secondary" to="/dashboard">Cancel</router-link>
          </form>
        </div>
      </div>
        
    </div>
    `,
    data() {
        return {
            error:null,
            success_message:null,
            book_name: null,
            deleted:null
        };
    },
    methods :{
        async Delete(){
            try {
                const response = await fetch('/book', {
                  method: 'DELETE',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name : this.book_name
                  }),
                });
                const data = await response.json();
        
                if (response.ok) {
                  this.success_message = data.message;
                  setTimeout(() => {
                    this.success_message = null;
                    this.$router.push({path:'/dashboard'})
                  }, 3500);
                } else {
                    this.error = data.error;
                    setTimeout(() => {
                         this.error=null
                      }, 3500);
                  
                }
              } catch (error) {
                console.error(error);
              }
        }
    },
    mounted(){
        this.book_name = this.$route.params.book_name;
    }
}
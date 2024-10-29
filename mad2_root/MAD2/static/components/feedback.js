import user_nav from "./user_nav.js";

export default{
    components:{
        user_nav
    },
    template:`
    <div>
        <user_nav></user_nav>
        <div class="container" style="margin-top:5%">
        <div class="add-book-box">
          <h2 style="text-align: center; color: #333;">Change Book {{ book_name }}</h2>

          <p v-if="error && !success_message" class="alert alert-danger mt-3" role="alert" style="text-align:center">{{ error }}</p>
          <p v-if="success_message" class="alert alert-success mt-3" role="alert" style="text-align:center">{{ success_message }}</p>

          <form @submit.prevent="feedbackPost" >

            <div class="form-group">
              <label for="feedback"><strong>Feedback:</strong></label>
              <textarea class="form-control" id="feedback" v-model="feedback" name="description" rows="4" required></textarea>
            </div>

            <br>
            <button type="submit" class="btn btn-primary">Post</button>
            <router-link style="margin-left:1%" class="btn btn-secondary" to="/user-dashboard">Cancel</router-link>
          </form>
        </div>
      </div>
        
    </div>
    `,
    data() {
        return {
            feedback:null,
            error:null,
            success_message:null,
            book_name: null
        };
    },
    methods :{
        async feedbackPost(){
            try {
                const response = await fetch('/feedback', {
                  method: 'POST',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name : this.book_name,
                    feedback: this.feedback
                  }),
                });
                const data = await response.json();
        
                if (response.ok) {
                  this.success_message = data.message;
                  this.feedback= null
                  setTimeout(() => {
                    this.success_message = null;
                    this.$router.push({path:'/user-dashboard'})
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
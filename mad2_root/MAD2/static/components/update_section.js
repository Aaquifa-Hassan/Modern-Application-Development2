import admin_nav from "./admin_nav.js";

export default{
    components:{
        admin_nav
    },
    template:`
    <div>
        <admin_nav></admin_nav>
        <div class="container">
        <div class="add-book-box">
          <h2 style="text-align: center; color: #333;">Change Section {{ section_name }}</h2>

          <p v-if="error && !success_message" class="alert alert-danger mt-3" role="alert" style="text-align:center">{{ error }}</p>
          <p v-if="success_message" class="alert alert-success mt-3" role="alert" style="text-align:center">{{ success_message }}</p>

          <form @submit.prevent="Update" >
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" class="form-control" id="title" v-model="title" name="name">
            </div>

            <div class="form-group">
              <label for="description">Description:</label>
              <textarea class="form-control" id="description" v-model="description" name="description" rows="4" ></textarea>
            </div>
            <br>
            <button type="submit" class="btn btn-primary">update Book</button>
            <router-link style="margin-left:1%" class="btn btn-secondary" to="/dashboard">Cancel</router-link>
          </form>
        </div>
      </div>
        
    </div>
    `,
    data() {
        return {
            title:null,
            description:null,
            error:null,
            success_message:null,
            section_name: null
        };
    },
    methods :{
        async Update(){
            try {
                const response = await fetch('/section', {
                  method: 'PUT',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name : this.title,
                    old_name : this.section_name,
                    description: this.description
                  }),
                });
                const data = await response.json();
        
                if (response.ok) {
                  this.success_message = data.message;
                  this.section_name = data.new_name
                  setTimeout(() => {
                    this.success_message = null;
                    this.title= null,
                    this.description= null
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
        this.section_name = this.$route.params.section_name;
    }
}
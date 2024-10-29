import user_nav from "./user_nav.js";

export default {
  components: {
    user_nav
  },
  template: `
    <div>
      <user_nav></user_nav>
      <div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
        <div class="card p-4" style="width: 400px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">

          <p v-if="success_message" class="alert alert-success text-center">{{ success_message }}</p>

          <div v-else-if="requested">
            <p  class="alert alert-danger text-center">{{ requested }}<br></p>
            <router-link style="margin-left:25%" class="btn btn-secondary" to="/user-dashboard">Go back to Dashboard</router-link>
          </div>
          
          <p v-else-if="error" class="alert alert-danger text-center">{{ error }}</p>
          <div v-else-if="limitError >= 5" >
            <p class="alert alert-danger text-center">Maximum request Limit Reached</p>
            <router-link style="margin-left:25%" class="btn btn-secondary" to="/user-dashboard">Go back to Dashboard</router-link>
          </div>
          <div v-else>
            <div v-if="book">
            <h3 class="text-center mb-4">Confirm book request for {{ book ? book.name : '' }}</h3>
            <form @submit.prevent="confirmRequest(book.id)">
              <div class="d-flex justify-content-between align-items-center">
                <button type="submit" class="btn btn-primary mr-2" style="min-width: 80px;">Request</button>
                <router-link class="btn btn-secondary" to="/user-dashboard">Cancel</router-link>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      success_message:null,
      error: null,
      limitError: null,
      book: null,
      requested:null
    };
  },
  methods: {
    async confirmRequest(id) {
        try {
            const response = await fetch('/bookrequest', {
              method: 'POST',
              headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                book_id: id
              }),
            });
            const data = await response.json();
    
            if (response.ok) {
                this.success_message = data.message;
                setTimeout(() => {
                  this.success_message = null;
                  this.$router.push({path:'/user-dashboard'})
                }, 3500);
            } else {
              this.error = data.message
              
            }
          } catch (error) {
            console.error(error);
          }
    },
    async fetchdata(bookName) {
      try {
        const response = await fetch('/fetchdata', {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book_name: bookName
          }),
        });
        const data = await response.json();

        if (response.ok) {
          this.book = data.message;
          this.limitError = data.message.limitError
          this.requested = data.message.requested
        } else {
          this.error = 'There was an unexpected error';
          console.log(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchdata(this.$route.params.book_name)
  }
};


  
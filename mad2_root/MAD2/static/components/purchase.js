import user_nav from "./user_nav.js";

export default {
    components: {
        user_nav
    },
    template: `
    <div>
        <user_nav></user_nav>

        <div class="add-book-box">
            <h2 style="text-align: center; color: #333;">Purchase book {{ book_name }}</h2>

            <p v-if="error && !success_message" class="alert alert-danger mt-3" role="alert" style="text-align:center;">{{ error }}</p>
            <p v-if="success_message" class="alert alert-success mt-3" role="alert" style="text-align:center;">{{ success_message }}</p>

            <form v-if="!success_message && !message" @submit.prevent="purchase" style="margin-left: 42%; margin-top: 2%;">
                <strong style="color:red; font-size: 25px;">Pay and Download pdf?</strong>
                <br>
                <button type="submit" class="btn btn-primary" >Pay & Download</button>
                <router-link style="margin-left: 1%;" class="btn btn-secondary" to="/user-dashboard">Cancel</router-link>
            </form>
            <form v-if="!success_message && message" @submit.prevent="purchase" style="margin-left: 42%; margin-top: 2%;">
                <strong style="color:red; font-size: 25px;">You have already paid for this!<br>Wanna Download again?</strong>
                <br>
                <button type="submit" class="btn btn-primary" >Download</button>
                <router-link style="margin-left: 1%;" class="btn btn-secondary" to="/user-dashboard">Cancel</router-link>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            error: null,
            success_message: null,
            book_name: null,
            message:null
        };
    },
    methods: {
        async purchase() {
            try {
                const response = await fetch('/purchase', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.book_name
                    }),
                });
                const data = await response.json();

                if (response.ok) {
                    
                    this.success_message = "Thank you for the purchase";
                    window.location.href = `/purchase/${this.book_name}`
                    setTimeout(() => {
                        this.success_message = null;
                        this.$router.push({ path: '/user-dashboard' })
                    }, 3500);
                } else {
                    this.error = data.error;
                    setTimeout(() => {
                        this.error = null;
                    }, 3500);

                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchdata(){
            try {
                const response = await fetch(`/purchasefetch/${this.book_name}`, {
                  method: 'GET',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                  }
                });
                const data = await response.json();
        
                if (response.ok) {
                  this.message = data.message;
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
        this.book_name = this.$route.params.book_name;
        this.fetchdata()
    }
}

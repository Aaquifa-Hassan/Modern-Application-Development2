import user_nav from "./user_nav.js";

export default {
    components:{
        user_nav
    },
    template: `
        <div>
            <user_nav></user_nav>

            <div v-if=" books.length ==0 " style="margin-top: 15%; margin-left: -0%; color: red; font-size: 1.2rem; text-align: center;">
                No books have been lend
            </div>
            <div v-else style="margin-top: 20px; display: flex; flex-wrap: wrap; justify-content: space-around;">
                <div v-for="book in books" :key="book.book_id" style="width: 300px; margin-bottom: 20px; border: 1px solid #ccc; padding: 20px; border-radius: 5px;">
                    <strong style="color: #333;">Title:</strong> {{ book.name }}<br>
                    <strong style="color: #333;">Content:</strong> {{ book.content }}<br>
                    <strong style="color: #333;">Date of Issue:</strong> {{ book.date_issued }}<br>
                    <strong style="color: #333;">Author:</strong> {{ book.author }}<br>
                    <strong style="color: #333;">Return date:</strong> {{ book.return_date }} <br>

                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">

                        <form @submit.prevent="returnBook(book.lendid)" style="display: inline-block;">
                            <button type="submit" style="background-color: #2196f3; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer;">Return</button>
                        </form>
                        <router-link :to="{ name: 'purchase-book', params: { book_name: book.name } }" style="display: inline-block;">
                            <button style="background-color: #4caf50; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer;" class="btn btn-success">Purchase</button>
                        </router-link>
                        
                        <router-link :to="{ name: 'feedback', params: { book_name: book.name } }"  style="display: inline-block;">
                            <button style="background-color: #6c757d; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer;" class="btn btn-secondary">Feedback</button>
                        </router-link>
                    
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return{
            books: []
        }
    },
    methods: {
        async returnBook(id) {
            try {
                const response = await fetch('/booklended', {
                  method: 'DELETE',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id : id
                  }),
                });
                const data = await response.json();
        
                if (response.ok) {
                    this.$router.push({path:'/mybook'})
                    this.fetchdata()
                } else {
                       console.log(data.error)
                  
                }
              } catch (error) {
                console.error(error);
              }
        },
        async fetchdata(){
            try {
                const response = await fetch('/mybooks', {
                  method: 'GET',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                  }
                });
                const data = await response.json();
        
                if (response.ok) {
                  this.books = data.books;
                } else {
                  this.error = 'There was an unexpected error';
                  console.log(data.error);
                }
              } catch (error) {
                console.error(error);
              }
        }
    },
    mounted(){
        this.fetchdata()
    }
}

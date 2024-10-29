import admin_nav from "./admin_nav.js";

export default {
  components: {
    admin_nav
  },
  template: `
    <div>
      <admin_nav></admin_nav>
      <div class="container">
        <div class="add-book-box">
          <h2 style="text-align: center; color: #333;">Add New Book</h2>

          <p v-if="error && !success_message" class="alert alert-danger mt-3" role="alert" style="text-align:center">{{ error }}</p>
          <p v-if="success_message" class="alert alert-success mt-3" role="alert" style="text-align:center">{{ success_message }}</p>

          <form @submit.prevent="addBook" >
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" class="form-control" id="title" v-model="book.title" name="name" required>
            </div>

            <div class="form-group">
              <label for="content">Content:</label>
              <textarea class="form-control" id="content" v-model="book.content" name="content" rows="4" required></textarea>
            </div>

            <div class="form-group">
              <label for="price">Price:</label>
              <input type="number" class="form-control" id="price" v-model="book.price" name="price" min="0" required>
            </div>

            <div class="form-group">
              <label for="author">Author:</label>
              <input type="text" class="form-control" id="author" v-model="book.author" name="author" required>
            </div>

            <div class="form-group">
              <label for="date">Date Issued:</label>
              <input type="date" max="{{current_date}}" class="form-control" id="date" v-model="book.date_issued" name="date_issued" required>
            </div>

            <div class="form-group">
              <label for="return_date">No of Days can be hold:</label>
              <div class="input-group">
                <span class="input-group-text">Days:</span>
                <input type="number" id="days" name="days" class="form-control" v-model="book.days" min="0" placeholder="Days" required>
                <span class="input-group-text">Hours:</span>
                <input type="number" id="hours" name="hours" class="form-control" v-model="book.hours" min="0" max="23" placeholder="Hours" required>
              </div>
            </div>

            <div class="form-group">
              <label>Existing Sections: (Optional)</label>
              <select class="form-control" name="ExistingSection" v-model="book.selectedSection">
                <option value="Default" selected>None selected</option>
                <option v-for="section in sections" :value="section.id">{{ section.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>New Section: (Optional)</label>
              <input type="text" class="form-control" v-model="book.newSection" name="NewSection" placeholder="Fill if your desired Section is not above" autofocus>
            </div><br>

            <button type="submit" class="btn btn-primary">Add Book</button>
            <router-link style="margin-left:1%" class="btn btn-secondary" to="/dashboard">Cancel</router-link>
          </form>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      sections: [],
      book: {
        title: null,
        content: null,
        price: null,
        author: null,
        date_issued: null,
        days: null,
        hours:null,
        selectedSection: 'Default',
        newSection: null,
      },
      current_date:null,
      success_message: null,
      error: null
    };
  },
  methods: {

    getcurrentdate(){
      const response = fetch("/getdate",{
        method: 'GET',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          }
        });
        const data = response.json();

        if (response.ok) {
          this.current_date = data.current_date;
        } else {
          this.error = 'There was an unexpected error';
          console.log(data.error);
        }
    },
    async fetchdata() {
      try {
        const response = await fetch('/book', {
          method: 'GET',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          }
        });
        const data = await response.json();

        if (response.ok) {
          this.sections = data.sections;
        } else {
          this.error = 'There was an unexpected error';
          console.log(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async addBook() {
      try {
        const response = await fetch('/book', {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name : this.book.title,
            content: this.book.content,
            price:this.book.price,
            author:this.book.author,
            days:this.book.days,
            hours:this.book.hours,
            date_issued:this.book.date_issued,
            ExistingSection:this.book.selectedSection,
            NewSection:this.book.newSection
          }),
        });
        const data = await response.json();

        if (response.ok) {
          this.success_message = data.message;
          setTimeout(() => {
            this.success_message = null;
            this.book = {
              title: null,
              content: null,
              price: null,
              author: null,
              days: null,
              hours:null,
              return_date: null,
              selectedSection: 'Default',
              newSection: null,
            };
            window.location.reload(true);
            this.$router.push({path:'/add-book'})
          }, 3500);
        } else {
            setTimeout(() => {
                this.error = data.error; 
              }, 3500);
          
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchdata();
    this.getcurrentdate();
  }
};

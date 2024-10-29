export default {
    template: `
    <div>
    <div v-if="!sections.length && !inSearch" class="alert alert-info" role="alert" style="text-align: center;">
        No books have been added yet.
    </div>

    <div class="container d-flex justify-content-between" style="margin-left:2%;margin-top:1%">
      <div class="row">
        <div class="col-md-7"> <!-- Search box -->
          <input autofocus @input="search" type="text" v-model="query" placeholder="Search....." class="form-control search-input" style="margin-bottom: 10px;">
        </div>
        <div class="col-md-5"> <!-- Select option -->
          <select id="selectedItems" v-model="displaytype" class="form-select" style="font-size: 16px;">
            <option v-for="searchmethod in searchmethods">{{ searchmethod }}</option>
          </select>
        </div>
      </div>
      <div class="justify-content-end" style="margin-right:-40%">
        <form @submit.prevent="addBook">
            <button @click="addBook" class="btn btn-success" type="submit">Add New Books</button>
        </form>
      </div>
    </div>  

    <div v-for="section in sections" :key="section.name">
        <section class="card mb-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-4">{{ section.name }}</h3>
                <div v-if="section.books.length > 0" class="row">
                    <div v-for="book in section.books" :key="book.book_id" class="col-md-2">
                        <div class="card">
                            <div class="card-body">
                                <label class="card-text"><strong>Title:</strong> {{ book.name }}</label><br>
                                <label class="card-text"><strong>Content:</strong> {{ book.content }}......</label><br>
                                <label class="card-text"><strong>Date of issue:</strong> {{ book.date_issued }}</label><br>
                                <label class="card-text"><strong>Author:</strong> {{ book.author }}</label><br>
                                <label class="card-text"><strong>Price: </strong> Rs.{{ book.price }}</label><br>
                                <label class="card-text"><strong>Holding days:</strong> {{ book.days }} days and {{ book.hours }} hours</label><br>
                                <div class="d-flex justify-content-between align-items-center">
                                    <router-link :to="{ name: 'update-book', params: { book_name: book.name } }">
                                        <button type="submit" class="btn btn-primary">Update</button>
                                    </router-link>
                                    <router-link :to="{ name: 'delete-book', params: { book_name: book.name } }">
                                        <button class="btn btn-danger">Delete</button>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <p v-else class="text-muted">No books in this section</p>
                <br>
                <div class="d-flex justify-content-between">
                    <router-link :to="{ name: 'update-section', params: { section_name: section.name } }">
                        <button class="btn btn-primary" type="submit">Update Section</button>
                    </router-link>
                    <router-link :to="{ name: 'delete-section', params: { section_name: section.name } }">
                        <button class="btn btn-danger" type="submit">Delete Section</button>
                    </router-link>
                </div>
            </div>
        </section>
    </div>
    
</div>


    `,
    data() {
      return {
        sections: [],
        query:null,
        searchmethods:['Section','Title','Price'],
        displaytype:'Section',
        ogSection:null,
        inSearch:false
      };
    },
    
    methods: {
      
      search(){
        
        this.sections = this.ogSection
        this.inSearch = true

        if (this.displaytype === 'Section'){
            this.sections = this.sections.filter(section => {
              return section.name.toLowerCase().includes(this.query.toLowerCase());
            })
        }else if (this.displaytype === 'Title'){

          this.sections = this.sections.map(section => {
            return {
              ...section,
              books: section.books.filter(book => {
                return book.name.toLowerCase().includes(this.query.toLowerCase());
              })
            };
          }).filter(section => section.books.length > 0); 
    
        }else if (this.displaytype === 'Price'){

          const queryPrice = parseFloat(this.query);
          if (!isNaN(queryPrice)) {
      
            this.sections = this.sections.map(section => {
            return {
              ...section,
              books: section.books.filter(book => {
                return book.price <= queryPrice;
              })
            };
            }).filter(section => section.books.length > 0); 
          } else {
            this.sections = [...this.sections];
          }

        }
    },
      addBook() {
        this.$router.push({path:'/add-book'})
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
            this.ogSection = data.sections
          } else {
            this.error = 'There was an unexpected error';
            console.log(data.error);
          }
        } catch (error) {
          console.error(error);
        }
      },
    },

    mounted() {
        this.fetchdata();
    }
};
  
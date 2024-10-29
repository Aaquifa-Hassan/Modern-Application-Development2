import admin_nav from "./admin_nav.js";

export default {
    components:{
        admin_nav
    },
    template: `
        <div>
        <admin_nav></admin_nav>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="request-container">
                        <h2 class="section-title">Requests</h2>
                        <p v-if="message1" class="alert alert-info">{{ message1 }}</p>
                        <ul class="list-group">
                            <li v-for="request in requests" :key="request.id" class="list-group-item d-flex justify-content-between align-items-center request-item">
                                <div>
                                    <strong>User:</strong> {{ request.username }}<br>
                                    <strong>Book:</strong> {{ request.book_name }}
                                </div>
                                <div>
                                    <form style="margin-left: 10px;float:inline-end;"  @submit.prevent="deleteRequest(request.id)">
                                        <button style="max-width: 200px;" type="submit" class="btn btn-danger">Delete</button>
                                    </form>
                                    <form style="float: inline-end;" @submit.prevent="approveRequest(request.id)">
                                        <button type="submit" class="btn btn-success">Approve</button>
                                    </form>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="issued-container">
                        <h2 class="section-title">Issued</h2>
                        <p v-if="message2" class="alert alert-info">{{ message2 }}</p>
                        <ul class="list-group">
                            <li v-for="supply in supplied" :key="supply.id" class="list-group-item d-flex justify-content-between align-items-center issued-item">
                                <div>
                                    <strong>User:</strong> {{ supply.username }}<br>
                                    <strong>Book:</strong> {{ supply.book_name }}<br>
                                </div>
                                <form @submit.prevent="revokeBook(supply.id)">
                                    <button type="submit" class="btn btn-warning">Revoke</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `,
    data(){
        return{
            requests: null,
            supplied: null,
            message1: null,
            message2: null
        }
    },
    methods: {
        async deleteRequest(id) {
            try {
                const response = await fetch('/bookrequest', {
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
                    this.$router.push({path:'/access'})
                    this.fetchrequestsdata()
                    this.fetchissueddata()
                } else {
                    console.log(data.error)
                }
              } catch (error) {
                console.error(error);
              }
        },
        async approveRequest(id) {
            try {
                const response = await fetch('/booklended', {
                  method: 'POST',
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
                    this.$router.push({path:'/access'})
                    this.fetchrequestsdata()
                    this.fetchissueddata()
                } else {
                       console.log(data.error)
                  
                }
              } catch (error) {
                console.error(error);
              }
        },
        async revokeBook(id) {
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
                    this.$router.push({path:'/access'})
                    this.fetchrequestsdata()
                    this.fetchissueddata()
                } else {
                       console.log(data.error)
                  
                }
              } catch (error) {
                console.error(error);
              }
        },
        async fetchrequestsdata(){
            try {
                const response = await fetch('/bookrequest', {
                  method: 'GET',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                  }
                });
                const data = await response.json();
        
                if (response.ok) {
                  this.requests = data.requests;
                  this.message1= data.message
                } else {
                  this.error = 'There was an unexpected error';
                  console.log(data.error);
                }
              } catch (error) {
                console.error(error);
              }
        },
        async fetchissueddata(){
            try {
                const response = await fetch('/booklended', {
                  method: 'GET',
                  headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                  }
                });
                const data = await response.json();
        
                if (response.ok) {
                  this.supplied = data.supplied;
                  this.message2 = data.message
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
        this.fetchrequestsdata()
        this.fetchissueddata()
    }
}

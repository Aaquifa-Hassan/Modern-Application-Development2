
export default {
    template: `
        <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: red;">
            <router-link style="margin-left:1%" class="navbar-brand" to="/user-dashboard">Library</router-link>

            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/mybook">My books</router-link>
                    </li>
                    <li class="nav-item">
                        <button @click="logout" class="nav-link" style="color: white;">Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    `,
    methods: {
        logout() {
          localStorage.removeItem('auth-token'),
          localStorage.removeItem('role'),
          this.$router.push('/'),
          window.location.reload(true);
        },
    }
}
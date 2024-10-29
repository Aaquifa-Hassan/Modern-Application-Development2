import login from './components/login.js'
import signup from './components/signup.js'
import admin_login from './components/admin_login.js'
import dashboard from './components/dashboard.js'
import add_book from './components/add_book.js'
import update_section from './components/update_section.js'
import delete_section from './components/delete_section.js'
import update_book from './components/update_book.js'
import delete_book from './components/delete_book.js'
import user_dashboard from './components/user_dashboard.js'
import feedback from './components/feedback.js'
import user_request from './components/user_request.js'
import access from './components/access.js'
import mybook from './components/mybook.js'
import purchase from './components/purchase.js'

const routes = [
    { path: '/', component: login, name:'login'},
    { path: '/signup', component: signup, name:'signup'},
    { path: '/admin-login', component: admin_login, name:'admin_login'},
    { path: '/dashboard', component: dashboard, name:'dashboard'},
    { path: '/add-book', component: add_book, name:'add-book'},
    { path: '/update-section/:section_name', component: update_section, name:'update-section'},
    { path: '/delete-section/:section_name', component: delete_section, name:'delete-section'},
    { path: '/update-book/:book_name', component: update_book, name:'update-book'},
    { path: '/delete-book/:book_name', component: delete_book, name:'delete-book'},
    { path: '/user-dashboard', component: user_dashboard, name:'user-dashboard'},
    { path: '/feedback/:book_name', component: feedback, name:'feedback'},
    { path: '/request/:book_name', component: user_request, name:'request'},
    { path: '/access', component: access, name:'access'},
    { path: '/mybook', component: mybook, name:'mybook'},
    { path: '/purchase-book/:book_name', component: purchase, name:'purchase-book'},
]


export default new VueRouter({
    routes,
})
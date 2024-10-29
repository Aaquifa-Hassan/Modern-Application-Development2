import router from "./router.js"

router.beforeEach((to, from, next) => {
    const permitted = ['admin_login', 'login', 'signup'];
  
    if (!localStorage.getItem('auth-token') && !permitted.includes(to.name)) {
      next({ name: 'login' });
    } else {
      next();
    }
  })

new Vue({
    el:'#app',
    template:`
        <div>
            <router-view/>
        </div>`,
    router,
})
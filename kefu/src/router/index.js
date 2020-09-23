import Vue from 'vue'
import Router from 'vue-router';
import Login from '../pages/login/index.vue';
import Contact from '../pages/chat/index.vue';
import User from '../pages/chat/user.vue';
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { 
            path: '',
            redirect: '/login'
        },
        { 
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'login',
            component: Login
        },
        {
            path: '/contact/:id',
            name: 'contact',
            component: Contact
        },
        {
            path: '/contact',
            name: 'contact',
            component: Contact
        },
        {
            path: '/contact1/:id',
            name: 'contact',
            component: User
        },
        {
            path: '/contact1',
            name: 'contact',
            component: User
        },
        {
            path: '/group/:id',
            name: 'group',
            component: Contact
        },
        {
            path: '/group',
            name: 'group',
            component: Contact
        },
        {
            path: '/chatroom/:id',
            name: 'chatroom',
            component: Contact
        },
        {
            path: '/chatroom',
            name: 'chatroom',
            component: Contact
        },
    ]
})

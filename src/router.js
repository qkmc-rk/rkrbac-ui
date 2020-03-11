import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {getToken} from './utils/cookie';
import axios from './axios';

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/member/user'
        },
        {
            path: '/user',
            component: () => import(/* webpackChunkName: "layouts" */ './layouts/UserLayout'),
            children: [
                {
                    path: '/user/login',
                    name: 'login',
                    component: () => import(/* webpackChunkName: "user" */ './views/User/Login')
                },
                {
                    path: '/user/register',
                    name: 'register',
                    component: () => import(/* webpackChunkName: "user" */ './views/User/Register')
                },
                {
                    path: '/user/forget',
                    name: 'forget',
                    component: () => import(/* webpackChunkName: "user" */ './views/User/Forget')
                }
            ]
        },
        {
            path: '/member',
            component: () => import(/* webpackChunkName: "layouts" */ './layouts/BasicLayout'),
            children: [
                {
                    path: '/member/user',
                    name: 'user-list',
                    component: () => import(/* webpackChunkName: "member" */ './views/Member/User')
                },
                {
                    path: '/member/permission',
                    name: 'permission',
                    component: () => import(/* webpackChunkName: "member" */ './views/Member/Permission')
                },
                {
                    path: '/member/role',
                    name: 'role',
                    component: () => import(/* webpackChunkName: "member" */ './views/Member/Role')
                }
            ]
        },
        {
            path: '*',
            name: 'NotFound',
            component: () => import(/* webpackChunkName: "dashboard" */ './views/404')
        },
    ]
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    // 放行的URL
    const whiteList = ['/user/login', '/user/register', '/user/forget'];
    // 用户已登录
    if (getToken()) {
        if (to.path === '/login') {
            next({path: '/'});
        } else {
            // 切换路由时验证当前用户登陆信息
            axios({url: '/user/getUser', method: 'get', params: null}).then(() => {
                next();
            }).catch(() => {
            });
        }
    } else { // 用户未登录
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/user/login');
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error);
};

export default router;

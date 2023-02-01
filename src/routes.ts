import { RouteRecordRaw } from "vue-router";
import Index from './pages/Index.vue'
import Schema from './pages/Schema.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Index
    },
    {
        path: '/schema',
        name: 'Schema',
        component: Schema
    }
]

export {routes}
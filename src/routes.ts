import { RouteRecordRaw } from "vue-router";
import Index from './pages/Index.vue'
import Schema from './pages/Schema.vue'
import Schema2 from './pages/Schema2.vue'

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
    },
    {
        path: '/schema2',
        name: 'Schema2',
        component: Schema2
    }
]

export {routes}
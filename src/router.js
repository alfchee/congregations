import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Congregations from '@/views/Congregations.vue'
import Users from '@/views/Users.vue'
import CongregationDetails from '@/views/CongregationDetails.vue'
import CongregationModalForm from '@/components/CongregationModalForm.vue'
import SignIn from '@/views/SignIn.vue'
import AuthService from '@/services/AuthService'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard
    },
    {
      path: '/details/:id',
      name: 'congregation-details',
      component: CongregationDetails,
      props: true
    },
    {
      path: '/congregations',
      name: 'congregations',
      component: Congregations,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'create',
          name: 'congregations-create',
          component: CongregationModalForm
        },
        {
          path: 'edit/:id',
          name: 'congregations-edit',
          component: CongregationModalForm,
          props: true
        }
      ]
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
})

router.beforeEach(async (routeTo, routeFrom, next) => {
  // get the current user
  const currentUser = await AuthService.getCurrentUser()

  const requiresAuth = routeTo.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    if (currentUser) {
      next()
      return
    }
    next('sigin')
  } else {
    next()
  }
})

export default router

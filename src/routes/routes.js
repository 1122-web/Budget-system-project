import LandingPage from '../component/LandingPage';
import SignUp from '../component/SignUp';
import SignIn from '../component/SignIn';
import Dashboard from '../layout/Dashboard';
import Budget from '../component/Budget';
import Income from '../component/Income';
import Expense from '../component/Expense';
import Saving from '../component/Saving';
import DashboardTable from '../component/DashboardTable';
import ForgotPassword from '../component/Forgetpassword';
const routes = [
  {
    path: '/',
    component: LandingPage ,
    name: 'landingPage',
    layout:'landing'
  },
  {
    path: '/signup',
    component: SignUp ,
    name: 'signup',
    layout:'Auth'

  },
  {
    path: '/signin',
    component: SignIn ,
    name: 'signin',
    layout:'Auth'

  },
  {
    path: '/Forgetpassword',
    component: ForgotPassword ,
    name: 'Forgetpassword',
    layout:'Auth'
  },
  {
    path: '/dashboard',
    component: Dashboard ,
    name: 'dashboard',
    layout:'dashboard-main'
  },
  {
    path: '/DashboardTable',
    component: DashboardTable ,
    name: 'dashboardTable',
    layout:'dashboard'
  },
  {
    path: '/Income',
    component: Income ,
    name: 'Income',
    layout:'dashboard'
  },
  {
    path: '/Expense',
    component: Expense ,
    name: 'Expense',
    layout:'dashboard'
  },
  {
    path: '/Saving',
    component: Saving ,
    name: 'Saving',
    layout:'dashboard'
  },
  {
    path: '/Budget',
    component: Budget ,
    name: 'Budget',
    layout:'dashboard'
  },
];

export default routes;



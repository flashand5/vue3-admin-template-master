import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  // {
  // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
  // hidden: true // (默认 false)

//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
// redirect: 'noRedirect'

// 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
// alwaysShow: true
//
// name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
// meta: {
//   roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
//   title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
//   icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
//   noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
//   breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
//   affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)

  // 当路由设置了该属性，则会高亮相对应的侧边栏。
  // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
  // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
  // activeMenu: '/article/list'
// }
// }
{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        //使用el svg图标，同时使用elSvgIcon和icon时elSvgIcon优先
        meta: { title: '主页', elSvgIcon: 'Fold' }
      }
    ]
  },
  // {
  //   path: '/user-info',
  //   component: Layout,
  //   redirect: '/user-info/list',
  //   meta: { title: '个人中心', icon: 'bug' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/hmrpassm/user-info/userInfo.vue'),
  //       name: 'userinfo',
  //       meta: { title: '个人信息' }
  //     },
  //     {
  //       path: 'resetPass',
  //       component: () => import('@/views/hmrpassm/user-info/resetPass.vue'),
  //       name: 'resetPass',
  //       meta: { title: '修改密码' }
  //     },
  //   ]
  // },
  // {
  //   path: '/user-admin',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'userList',
  //       component: () => import('@/views/hmrpassm/user-info/userList.vue'),
  //       meta: { title: '用户管理', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/Dp-admin',
  //   component: Layout,
  //   redirect: '/Dp-admin/list',
  //   meta: { title: '职位部门管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/hmrpassm/department/departmentList.vue'),
  //       name: 'departmentList',
  //       meta: { title: '部门管理' }
  //     },
  //     {
  //       path: 'resetPass',
  //       component: () => import('@/views/hmrpassm/position/positionList.vue'),
  //       name: 'positionList',
  //       meta: { title: '职位管理' }
  //     },
  //   ]
  // },
  // {
  //   path: '/person-admin',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'personList',
  //       component: () => import('@/views/hmrpassm/person/personList.vue'),
  //       meta: { title: '人事管理', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/role-admin',
  //   component: Layout,
  //   redirect: '/role-admin/list',
  //   meta: { title: '权限管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/hmrpassm/role/roleList.vue'),
  //       name: 'roleList',
  //       meta: { title: '权限展示' }
  //     },
  //     {
  //       path: 'personRoleList',
  //       component: () => import('@/views/hmrpassm/role/personRoleList.vue'),
  //       name: 'personRoleList',
  //       meta: { title: '员工权限' }
  //     },
  //   ]
  // },
  // {
  //   path: '/proc-admin',
  //   component: Layout,
  //   redirect: '/proc-admin/list',
  //   meta: { title: '流程管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/hmrpassm/classify/classifyList.vue'),
  //       name: 'list',
  //       meta: { title: '流程分类' }
  //     },
  //     {
  //       path: 'stackList',
  //       component: () => import('@/views/hmrpassm/stack/proceStackList.vue'),
  //       name: 'stackList',
  //       meta: { title: '流程任务' }
  //     },
  //     {
  //       path: 'procList',
  //       component: () => import('@/views/hmrpassm/process/processList.vue'),
  //       name: 'procList',
  //       meta: { title: '流程模板' }
  //     },
  //     {
  //       path: 'prlaList',
  //       component: () => import('@/views/hmrpassm/process/processLaunchList.vue'),
  //       name: 'prlaList',
  //       meta: { title: '全部流程' }
  //     },
  //     {
  //       path: 'ApprList',
  //       component: () => import('@/views/hmrpassm/process/approvalList.vue'),
  //       name: 'ApprList',
  //       meta: { title: '全部审批' }
  //     },
  //     {
  //       path: 'myProc',
  //       component: () => import('@/views/hmrpassm/process/processLaunchList.vue'),
  //       name: 'myProc',
  //       meta: { title: '我的流程' }
  //     },
  //     {
  //       path: 'myAppr',
  //       component: () => import('@/views/hmrpassm/process/approvalList.vue'),
  //       name: 'myAppr',
  //       meta: { title: '我的审批' }
  //     },
  //   ]
  // },
  // {
  //   path: '/mess-admin',
  //   component: Layout,
  //   redirect: '/mess-admin/list',
  //   meta: { title: '消息', icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/hmrpassm/message/messageList.vue'),
  //       name: 'messageList',
  //       meta: { title: '消息管理' }
  //     },
  //     {
  //       path: 'send',
  //       component: () => import('@/views/hmrpassm/message/sendMessage.vue'),
  //       name: 'send',
  //       meta: { title: '发送消息' }
  //     },
  //     {
  //       path: 'processList',
  //       component: () => import('@/views/hmrpassm/message/messageList.vue'),
  //       name: 'processList',
  //       meta: { title: '我的发送' }
  //     },
  //     {
  //       path: 'myProcess',
  //       component: () => import('@/views/hmrpassm/message/messageList.vue'),
  //       name: 'myProcess',
  //       meta: { title: '我的接收' }
  //     },
  //     {
  //       path: 'myApproval',
  //       component: () => import('@/views/hmrpassm/message/unRead.vue'),
  //       name: 'myApproval',
  //       meta: { title: '未读消息' }
  //     },
  //   ]
  // },
  // {
  //   path: '/salary-admin',
  //   component: Layout,
  //   redirect: '/salary-admin/list',
  //   meta: { title: '薪酬管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/hmrpassm/salary/salaryList.vue'),
  //       name: 'salaryList',
  //       meta: { title: '薪酬列表' }
  //     },
  //     {
  //       path: 'createSalary',
  //       component: () => import('@/views/hmrpassm/salary/createSalary.vue'),
  //       name: 'createSalary',
  //       meta: { title: '发放薪酬' }
  //     },
  //     {
  //       path: 'mySalary',
  //       component: () => import('@/views/hmrpassm/salary/salaryList.vue'),
  //       name: 'mySalary',
  //       meta: { title: '我的薪酬' }
  //     }
  //   ]
  // },
  // {
  //   path: '/setting-switch',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/setting-switch'),
  //       name: 'SettingSwitch',
  //       meta: { title: '系统设置', icon: 'example' }
  //     }
  //   ]
  // },
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: '/error-log/list',
  //   meta: { title: '错误日志', icon: 'bug' },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/error-log'),
  //       name: 'ErrorLog',
  //       meta: { title: '错误日志' }
  //     },
  //     {
  //       path: 'error-log-test',
  //       component: () => import('@/views/error-log/ErrorLogTest.vue'),
  //       name: 'ErrorLogTest',
  //       meta: { title: '错误日志测试' }
  //     }
  //   ]
  // },
  {
    path: '/external-link',
    component: Layout,
    hidden: true,
    children: [
      {
        component: () => {},
        path: 'https://github.com/jzfai/vue3-admin-ts.git',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]
/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // 将始终显示根菜单
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['隐藏'] // 您可以在根导航中设置角色
    },
    children: [
      {
        path: 'roleIndex',
        component: () => import('@/views/permission'),
        name: 'Permission',
        meta: {
          title: 'role Index'
          //roles: ['admin'] // 或者您只能在子导航中设置角色
        }
      },
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // 或者您只能在子导航中设置角色
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // 如果不设置角色，则表示：此页面不需要权限
        }
      },
      {
        path: 'code-index',
        component: () => import('@/views/permission/CodePermission.vue'),
        name: 'CodePermission',
        meta: {
          title: 'Code Index'
        }
      },
      {
        path: 'code-page',
        component: () => import('@/views/permission/CodePage.vue'),
        name: 'CodePage',
        meta: {
          title: 'Code Page',
          code: 1
        }
      }
    ]
  },
  {
    path: '/user-info',
    component: Layout,
    redirect: '/user-info/list',
    meta: {
      title: '个人中心',
      icon: 'once',
      roles: ['管理员', '高级', '中级', '初级']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hmrpassm/user-info/userInfo.vue'),
        name: 'userinfo',
        meta: {
          title: '个人信息',
          roles: ['管理员', '高级', '中级', '初级']
        }
      },
      {
        path: 'resetPass',
        component: () => import('@/views/hmrpassm/user-info/resetPass.vue'),
        name: 'resetPass',
        meta: {
          title: '修改密码',
          roles: ['管理员', '高级', '中级', '初级']
        }
      },
    ]
  },
  {
    path: '/user-admin',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'userList',
        component: () => import('@/views/hmrpassm/user-info/userList.vue'),
        meta: {
          title: '用户管理',
          icon: 'table',
          roles: ['管理员', '高级']
        }
      }
    ]
  },
  {
    path: '/Dp-admin',
    component: Layout,
    redirect: '/Dp-admin/list',
    meta: {
      title: '职位部门管理',
      icon: 'example',roles: ['管理员']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hmrpassm/department/departmentList.vue'),
        name: 'departmentList',
        meta: {
          title: '部门管理',
          roles: ['管理员']
        }
      },
      {
        path: 'resetPass',
        component: () => import('@/views/hmrpassm/position/positionList.vue'),
        name: 'positionList',
        meta: {
          title: '职位管理',
          roles: ['管理员']
        }
      },
    ]
  },
  {
    path: '/person-admin',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'personList',
        component: () => import('@/views/hmrpassm/person/personList.vue'),
        meta: {
          title: '人事管理',
          icon: 'table',
          roles: ['管理员', '高级']
        }
      }
    ]
  },
  {
    path: '/role-admin',
    component: Layout,
    redirect: '/role-admin/list',
    meta: {
      title: '权限管理',
      icon: 'example',
      roles: ['管理员', '高级']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hmrpassm/role/roleList.vue'),
        name: 'roleList',
        meta: {
          title: '权限展示',
          roles: ['管理员', '高级']
        }
      },
      {
        path: 'personRoleList',
        component: () => import('@/views/hmrpassm/role/personRoleList.vue'),
        name: 'personRoleList',
        meta: {
          title: '员工权限',
          roles: ['管理员', '高级']
        }
      },
    ]
  },
  {
    path: '/proc-admin',
    component: Layout,
    redirect: '/proc-admin/list',
    meta: {
      title: '流程管理',
      icon: 'example',
      roles: ['管理员', '高级', '中级']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hmrpassm/classify/classifyList.vue'),
        name: 'list',
        meta: {
          title: '流程分类',
          roles: ['管理员', '高级']
        }
      },
      {
        path: 'stackList',
        component: () => import('@/views/hmrpassm/stack/proceStackList.vue'),
        name: 'stackList',
        meta: {
          title: '流程任务',
          roles: ['管理员', '高级']
        }
      },
      {
        path: 'procList',
        component: () => import('@/views/hmrpassm/process/processList.vue'),
        name: 'procList',
        meta: {
          title: '流程模板',
          roles: ['管理员', '高级', '中级']
        }
      },
      {
        path: 'prlaList',
        component: () => import('@/views/hmrpassm/process/processLaunchList.vue'),
        name: 'prlaList',
        meta: {
          title: '全部流程',
          roles: ['管理员', '高级']
        }
      },
      {
        path: 'ApprList',
        component: () => import('@/views/hmrpassm/process/approvalList.vue'),
        name: 'ApprList',
        meta: {
          title: '全部审批',
          roles: ['管理员', '高级']
        }
      },
      {
        path: 'myProc',
        component: () => import('@/views/hmrpassm/process/processLaunchList.vue'),
        name: 'myProc',
        meta: {
          title: '我的流程',
          roles: ['管理员', '高级', '中级']
        }
      },
      {
        path: 'myAppr',
        component: () => import('@/views/hmrpassm/process/approvalList.vue'),
        name: 'myAppr',
        meta: {
          title: '我的审批',
          roles: ['管理员', '高级', '中级']
        }
      },
    ]
  },
  {
    path: '/mess-admin',
    component: Layout,
    redirect: '/mess-admin/list',
    meta: {
      title: '消息',
      icon: 'example',
      roles: ['管理员', '高级', '中级', '初级']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hmrpassm/message/messageList.vue'),
        name: 'messageList',
        meta: {
          title: '消息管理',
          roles: ['管理员']
        }
      },
      {
        path: 'send',
        component: () => import('@/views/hmrpassm/message/sendMessage.vue'),
        name: 'send',
        meta: {
          title: '发送消息',
          roles: ['管理员', '高级', '中级', '初级']
        }
      },
      {
        path: 'processList',
        component: () => import('@/views/hmrpassm/message/messageList.vue'),
        name: 'processList',
        meta: {
          title: '我的发送',
          roles: ['管理员', '高级', '中级', '初级']
        }
      },
      {
        path: 'myProcess',
        component: () => import('@/views/hmrpassm/message/messageList.vue'),
        name: 'myProcess',
        meta: {
          title: '我的接收',
          roles: ['管理员', '高级', '中级', '初级']
        }
      },
      {
        path: 'myApproval',
        component: () => import('@/views/hmrpassm/message/unRead.vue'),
        name: 'myApproval',
        meta: {
          title: '未读消息',
          roles: ['管理员', '高级', '中级', '初级']
        }
      },
    ]
  },
  {
    path: '/salary-admin',
    component: Layout,
    redirect: '/salary-admin/list',
    meta: {
      title: '薪酬管理',
      icon: 'example',
      roles: ['管理员', '高级', '中级', '初级']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/hmrpassm/salary/salaryList.vue'),
        name: 'salaryList',
        meta: {
          title: '薪酬列表',
          roles: ['管理员', '高级']
        }
      },
      {
        path: 'createSalary',
        component: () => import('@/views/hmrpassm/salary/createSalary.vue'),
        name: 'createSalary',
        meta: {
          title: '发放薪酬',
          roles: ['管理员', '高级']
        }
      },
      {
        path: 'mySalary',
        component: () => import('@/views/hmrpassm/salary/salaryList.vue'),
        name: 'mySalary',
        meta: {
          title: '我的薪酬',
          roles: ['管理员', '高级', '中级', '初级']
        }
      }
    ]
  },
  {
    path: '/setting-switch',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/setting-switch'),
        name: 'SettingSwitch',
        meta: {
          title: '系统设置',
          icon: 'example',
          roles: ['管理员', '高级', '中级', '初级']
        }
      }
    ]
  },
  {
    path: '/error-log',
    component: Layout,
    redirect: '/error-log/list',
    meta: {
      title: '错误日志',
      icon: 'bug',
      roles: ['管理员', '高级', '中级', '初级']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/error-log'),
        name: 'ErrorLog',
        meta: {
          title: '错误日志',
          roles: ['管理员', '高级', '中级', '初级']
        }
      },
      {
        path: 'error-log-test',
        component: () => import('@/views/error-log/ErrorLogTest.vue'),
        name: 'ErrorLogTest',
        meta: {
          title: '错误日志测试',
          roles: ['管理员']
        }
      }
    ]
  },
  // 404页面一定要放在最后！！！
  // using pathMatch install of "*" in vue-router 4.0
  { path: '/:pathMatch(.*)', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export default router

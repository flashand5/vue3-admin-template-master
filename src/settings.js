const setting = {
  title: '人力资源管理流程审核系统',
  /**
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示标志
   */
  sidebarLogo: true,
  /**
   * @type {boolean} true | false
   * @description 是否在导航栏中显示标题
   */
  showNavbarTitle: false,
  /**
   * @type {boolean} true | false
   * @description 是否显示下拉
   */
  ShowDropDown: true,
  /**
   * @type {boolean} true | false
   * @description 是否显示 Hamburger
   */
  showHamburger: true,
  /**
   * @type {boolean} true | false
   * @description 是否显示设置右侧面板l
   */
  showLeftMenu: true,
  /**
   * @type {boolean} true | false
   * @description 是否显示标签视图
   */
  showTagsView: true,
  /**
   * @description TagsView show number
   */
  tagsViewNum: 6,
  /**
   * @type {boolean} true | false
   * @description 是否显示顶部导航
   */
  showTopNavbar: true,
  /* page  animation related*/
  /**
   * @type {boolean} true | false
   * @description Whether need animation of main area
   */
  mainNeedAnimation: true,
  /**
   * @type {boolean} true | false
   * @description 是否需要 nprogress
   */
   isNeedNprogress: true,

  /*page login or other*/
  /**
   * @type {boolean} true | false
   * @description 是否需要登录
   */
  isNeedLogin: true,
  /**
   * @type {string} 'roles' | 'code'
   */
  permissionMode: 'roles',
  /**
   * @type {boolean} true | false
   * @description 是否开放 prod mock
   */
  openProdMock: true,
  /**
   * @type {string | array} 'dev' | ['prod','test','dev'] according to the .env file props of VITE_APP_ENV
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['dev', 'test']
   */
  errorLog: ['dev', 'test'],
  /*
   * table height(100vh-delWindowHeight)
   * */
  delWindowHeight: '250px',
  /*
   * setting dev token when  isNeedLogin is setting false
   * */
  tmpToken: 'tmp_token',

  /*
   * vite.config.js base config
   * such as
   * */
  viteBasePath: '/vue3-admin-template/'
}

export default setting

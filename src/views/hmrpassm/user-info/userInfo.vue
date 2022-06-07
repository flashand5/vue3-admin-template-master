<template>
  <el-row class="el-row" :gutter="20">
    <el-col :span="6" :xs="24">
      <el-card class="box-card">
        <template #header>
          <div class="clearfix">
            <span>个人信息</span>
          </div>
        </template>
        <div>
          <div class="text-center">
            <el-upload
              class="avatar-uploader"
              style="border: 1px dashed black;border-radius: 10px"
              action="#"
              :http-request="uploadAction"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="personInfoPortrait" :src="personInfoPortrait" style="width: 100%;height: 100%;border-radius: 10px;" class="avatar"  alt="无法显示"/>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
          <ul class="list-group list-group-striped">
            <li class="list-group-item">
              <svg-icon icon-class="user" /> 用户名称
              <div class="pull-right">{{ userStore.userName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="user" /> 员工姓名
              <div class="pull-right">{{ personStore.personName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="tree" /> 所属部门
              <div class="pull-right">{{ personinfo.departmentName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="tree" /> 所属职位
              <div class="pull-right">{{ personinfo.positionName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="group_fill" /> 所属角色
              <div class="pull-right">{{ userStore.roles[0] }}</div>
            </li>
          </ul>
        </div>
      </el-card>
    </el-col>
    <el-col :span="18" :xs="24">
      <el-card>
          <!--  个人信息展示界面-->
          <div class="app-container">
            <el-form ref="form" :model="personinfo" label-width="120px">
              <el-form-item label="员工编号">
                <el-input v-model="personStore.personId" disabled />
              </el-form-item>
              <el-form-item label="性别">
                <el-select v-model="personinfo.personInfoGender" :disabled="config.isDisabled" placeholder="性别">
                  <el-option label="男" value="0" />
                  <el-option label="女" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="生日">
                <el-col :span="11">
                  <el-date-picker v-model="personinfo.personInfoBirth" :disabled="config.isDisabled" type="date" placeholder="点击选择日期" style="width: 100%" />
                </el-col>
                <el-col :span="2" class="line">-</el-col>
              </el-form-item>
              <el-form-item label="血型">
                <el-input v-model="personinfo.personInfoBloodType" :disabled="config.isDisabled" />
              </el-form-item>
              <el-form-item label="故乡">
                <el-input v-model="personinfo.personInfoHometown" :disabled="config.isDisabled" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="personinfo.personInfoMail" :disabled="config.isDisabled" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="personinfo.personInfoPhone" :disabled="config.isDisabled" />
              </el-form-item>
              <el-form-item label="毕业学校">
                <el-input v-model="personinfo.personInfoCollege" :disabled="config.isDisabled" />
              </el-form-item>
              <el-form-item label="个人描述">
                <el-input v-model="personinfo.personInfoDesc" :disabled="config.isDisabled" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button v-show="!config.isDisabled" type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="onEdit">{{ config.clickOpen }}</el-button>
              </el-form-item>
            </el-form>
          </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
// 获取当前组件的上下⽂
import {usePersonStore} from "@/store/person";
import { useUserStore } from '@/store/user';
import {ElMessage, ElMessageBox} from "element-plus";
import { Plus } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance()
const personStore = usePersonStore()
const userStore = useUserStore()
// 组件挂载时的钩子函数
onMounted(() => {
  selectInfo()

})

const personinfo = reactive({
  personInfoId: '',
  personInfoGender: '',
  personInfoBirth: '',
  personInfoBloodType: '',
  personInfoHometown: '',
  personInfoMail: '',
  personInfoPhone: '',
  personInfoCollege: '',
  personInfoDesc: '',
  departmentName: '',
  positionName: '',
})
const personInfoPortrait = ref('')

//上传成功钩子
const handleAvatarSuccess = (
  response,
  uploadFile
) => {
  personInfoPortrait.value = URL.createObjectURL(uploadFile.raw)
}

//文件限制
const beforeAvatarUpload = (rawFile) => {
  //文件类型
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg' ) {
    ElMessage.error('头像图片必须是JPG格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    //文件大小
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}
//上传事件
const uploadAction = (option) => {
  console.log(option)
  let formData = new FormData();
  formData.append("file", option.file)
  console.log(formData)
  // 接口参数
  let reqConfig = {
    url: '/system/personinfo/web/logo',
    method: 'post',
    data: formData,
    isParams: false,
    bfLoading: false,
    isAlertErrorMsg: false
  }
  // 接口响应
  axiosReq(reqConfig).then((res) => {
    if (res && res.code === 200) {
      ElMessage.success('图片上传成功！');
      selectInfo()
    } else {
      if (res && res.message) {
        ElMessage.error(res.message);
      } else {
        ElMessage.error('图片上传失败！');
      }
    }
  })
}

const config = reactive({
  isDisabled: true,
  clickOpen: "打开编辑"
})

// 查询信息的功能
let selectInfo = () => {
  const data = Object.assign({userName: userStore.userName})
  // 接口参数
  let reqConfig = {
    url: '/system/personinfo/getAllInfo',
    method: 'post',
    data,
    isParams: false,
    bfLoading: false,
    isAlertErrorMsg: false
  }
  // 接口响应
  axiosReq(reqConfig).then((resData) => {
    if (resData.code === 200){
      personInfoPortrait.value = resData.data?.personInfoPortrait
      Object.keys(resData.data).forEach((fItem) => {
        Object.keys(personinfo).forEach((sItem) => {
          if (fItem === sItem) {
            personinfo[sItem] = resData.data[sItem]
          }
        })
      })
    }else {
      ElMessageBox.alert(resData.message , resData.code, {
        confirmButtonText: 'OK',
      })
    }
  })
}
// 提交点击事件
const onSubmit = () => {
  proxy.$message('submit!')
  // 接口参数
  let infoConfig = {
    url: '/system/personinfo/updateInfo',
    method: 'post',
      data: personinfo,
    isParams: false,
    bfLoading: false,
    isAlertErrorMsg: false
  }
  // 接口响应
  axiosReq(infoConfig).then((resData) => {
    if (resData.code === 200){
      ElMessageBox.alert('您的个人信息已修改成功' , '成功', {
        confirmButtonText: 'OK',
      })
    }else {
      ElMessageBox.alert(resData.message , resData.code, {
        confirmButtonText: 'OK',
      })
    }
  })
}
// 编辑点击事件
const onEdit = () => {
  if (config.clickOpen === "打开编辑"){
    config.isDisabled = false
    config.clickOpen = "关闭编辑"
  }else {
    config.isDisabled = true
    config.clickOpen = "打开编辑"
  }
}


</script>

<style scoped>

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  text-align: center;
}

.el-row  .el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}

.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;
}

.pull-right {
  float: right !important;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

</style>

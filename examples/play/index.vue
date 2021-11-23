<!--
 * @Author: atdow
 * @Date: 2021-06-08 15:32:01
 * @LastEditors: null
 * @LastEditTime: 2021-11-23 14:41:36
 * @Description: 这里是用于测试组件调试的demo页面
-->
<template>
  <div style="margin: 20px;">
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input: 'Hello Element UI!',
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    },
  };
</script>

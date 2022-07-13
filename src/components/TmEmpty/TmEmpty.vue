<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-11 11:49:32
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-11 12:18:38
-->
<template>
  <div class="tm-empty-box">
    <svg
      t="1597117991068"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2660"
      width="90"
      height="90"
    >
      <path d="M457 335.8v165.6l397.7 1.1V372.8z" fill="#CBCBCB" p-id="2661" />
      <path d="M457 335.8V485l-321.5-32.7v-46.8z" fill="#B9B9B9" p-id="2662" />
      <path
        d="M136.6 405.5v432.6l380.3 76.3V442.5z"
        fill="#D3D3D3"
        p-id="2663"
      />
      <path
        d="M136.6 405.5l-74 160.4 380.3 76.3 74-199.7z"
        fill="#E9E9E9"
        p-id="2664"
      />
      <path
        d="M855.8 375v432.6L516.9 914.4V442.5z"
        fill="#C9C9C9"
        p-id="2665"
      />
      <path
        d="M855.8 375l103.5 168.8-338.8 106.8-103.6-208.1z"
        fill="#DDDDDD"
        p-id="2666"
      />
      <path
        d="M618.8 90.7l53.1-19.5-4.7 89.8-30.6 8.9zM688.5 176.6l17.7 13.6L789 92.6l-61.5-29.2zM752.7 215.9l11.4 31.6 95.3-31.6-10.9-63.2z"
        fill="#E9E9E9"
        p-id="2667"
      />
    </svg>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'TmEmptyCom',
  props: {
    text: {
      type: String,
      default: '这里空空如也'
    }
  }
}
</script>

<style lang="scss" scoped>
.tm-empty-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

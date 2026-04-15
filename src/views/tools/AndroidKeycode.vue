<template>
  <ToolLayout title="Android 键码">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索键名或键码..." />
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>键名</th><th>键码值</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.code">
              <td><code>{{ item.name }}</code></td>
              <td>{{ item.code }}</td>
              <td>{{ item.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const keycodes = [
  { name: 'KEYCODE_UNKNOWN', code: 0, desc: '未知按键' },
  { name: 'KEYCODE_SOFT_LEFT', code: 1, desc: '软左键' },
  { name: 'KEYCODE_SOFT_RIGHT', code: 2, desc: '软右键' },
  { name: 'KEYCODE_HOME', code: 3, desc: 'Home 键' },
  { name: 'KEYCODE_BACK', code: 4, desc: '返回键' },
  { name: 'KEYCODE_CALL', code: 5, desc: '拨号键' },
  { name: 'KEYCODE_ENDCALL', code: 6, desc: '挂断键' },
  { name: 'KEYCODE_0', code: 7, desc: '数字 0' },
  { name: 'KEYCODE_1', code: 8, desc: '数字 1' },
  { name: 'KEYCODE_2', code: 9, desc: '数字 2' },
  { name: 'KEYCODE_3', code: 10, desc: '数字 3' },
  { name: 'KEYCODE_4', code: 11, desc: '数字 4' },
  { name: 'KEYCODE_5', code: 12, desc: '数字 5' },
  { name: 'KEYCODE_6', code: 13, desc: '数字 6' },
  { name: 'KEYCODE_7', code: 14, desc: '数字 7' },
  { name: 'KEYCODE_8', code: 15, desc: '数字 8' },
  { name: 'KEYCODE_9', code: 16, desc: '数字 9' },
  { name: 'KEYCODE_STAR', code: 17, desc: '* 键' },
  { name: 'KEYCODE_POUND', code: 18, desc: '# 键' },
  { name: 'KEYCODE_DPAD_UP', code: 19, desc: '方向上' },
  { name: 'KEYCODE_DPAD_DOWN', code: 20, desc: '方向下' },
  { name: 'KEYCODE_DPAD_LEFT', code: 21, desc: '方向左' },
  { name: 'KEYCODE_DPAD_RIGHT', code: 22, desc: '方向右' },
  { name: 'KEYCODE_DPAD_CENTER', code: 23, desc: '方向中' },
  { name: 'KEYCODE_VOLUME_UP', code: 24, desc: '音量加' },
  { name: 'KEYCODE_VOLUME_DOWN', code: 25, desc: '音量减' },
  { name: 'KEYCODE_POWER', code: 26, desc: '电源键' },
  { name: 'KEYCODE_CAMERA', code: 27, desc: '相机键' },
  { name: 'KEYCODE_CLEAR', code: 28, desc: '清除键' },
  { name: 'KEYCODE_A', code: 29, desc: 'A 键' },
  { name: 'KEYCODE_B', code: 30, desc: 'B 键' },
  { name: 'KEYCODE_C', code: 31, desc: 'C 键' },
  { name: 'KEYCODE_D', code: 32, desc: 'D 键' },
  { name: 'KEYCODE_E', code: 33, desc: 'E 键' },
  { name: 'KEYCODE_F', code: 34, desc: 'F 键' },
  { name: 'KEYCODE_G', code: 35, desc: 'G 键' },
  { name: 'KEYCODE_H', code: 36, desc: 'H 键' },
  { name: 'KEYCODE_I', code: 37, desc: 'I 键' },
  { name: 'KEYCODE_J', code: 38, desc: 'J 键' },
  { name: 'KEYCODE_K', code: 39, desc: 'K 键' },
  { name: 'KEYCODE_L', code: 40, desc: 'L 键' },
  { name: 'KEYCODE_M', code: 41, desc: 'M 键' },
  { name: 'KEYCODE_N', code: 42, desc: 'N 键' },
  { name: 'KEYCODE_O', code: 43, desc: 'O 键' },
  { name: 'KEYCODE_P', code: 44, desc: 'P 键' },
  { name: 'KEYCODE_Q', code: 45, desc: 'Q 键' },
  { name: 'KEYCODE_R', code: 46, desc: 'R 键' },
  { name: 'KEYCODE_S', code: 47, desc: 'S 键' },
  { name: 'KEYCODE_T', code: 48, desc: 'T 键' },
  { name: 'KEYCODE_U', code: 49, desc: 'U 键' },
  { name: 'KEYCODE_V', code: 50, desc: 'V 键' },
  { name: 'KEYCODE_W', code: 51, desc: 'W 键' },
  { name: 'KEYCODE_X', code: 52, desc: 'X 键' },
  { name: 'KEYCODE_Y', code: 53, desc: 'Y 键' },
  { name: 'KEYCODE_Z', code: 54, desc: 'Z 键' },
  { name: 'KEYCODE_MENU', code: 82, desc: '菜单键' },
  { name: 'KEYCODE_SEARCH', code: 84, desc: '搜索键' },
  { name: 'KEYCODE_MEDIA_PLAY_PAUSE', code: 85, desc: '播放/暂停' },
  { name: 'KEYCODE_MEDIA_STOP', code: 86, desc: '媒体停止' },
  { name: 'KEYCODE_MEDIA_NEXT', code: 87, desc: '下一首' },
  { name: 'KEYCODE_MEDIA_PREVIOUS', code: 88, desc: '上一首' },
  { name: 'KEYCODE_MUTE', code: 91, desc: '静音键' },
  { name: 'KEYCODE_ENTER', code: 66, desc: '回车键' },
  { name: 'KEYCODE_DEL', code: 67, desc: '删除键' },
  { name: 'KEYCODE_TAB', code: 61, desc: 'Tab 键' },
  { name: 'KEYCODE_SPACE', code: 62, desc: '空格键' },
  { name: 'KEYCODE_SHIFT_LEFT', code: 59, desc: '左Shift' },
  { name: 'KEYCODE_SHIFT_RIGHT', code: 60, desc: '右Shift' },
  { name: 'KEYCODE_ALT_LEFT', code: 57, desc: '左Alt' },
  { name: 'KEYCODE_ALT_RIGHT', code: 58, desc: '右Alt' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? keycodes.filter(i => i.name.toLowerCase().includes(k) || String(i.code).includes(k) || i.desc.includes(k)) : keycodes
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-bar { display: flex; gap: 8px; }
.search-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th, .data-table td { padding: 8px 12px; border: 1px solid #d0d7de; text-align: left; }
.data-table th { background: #f6f8fa; font-weight: 600; }
.data-table tr:hover { background: #f0f6ff; }
code { background: #eef1f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
</style>

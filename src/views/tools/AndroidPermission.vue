<template>
  <ToolLayout title="Android 权限列表">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索权限名称或说明..." />
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>权限名称</th><th>级别</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.name">
              <td><code>{{ item.name }}</code></td>
              <td><span :class="['badge', item.level]">{{ item.level }}</span></td>
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
const permissions = [
  { name: 'android.permission.INTERNET', level: 'normal', desc: '访问网络' },
  { name: 'android.permission.READ_EXTERNAL_STORAGE', level: 'dangerous', desc: '读取外部存储' },
  { name: 'android.permission.WRITE_EXTERNAL_STORAGE', level: 'dangerous', desc: '写入外部存储' },
  { name: 'android.permission.CAMERA', level: 'dangerous', desc: '使用摄像头' },
  { name: 'android.permission.RECORD_AUDIO', level: 'dangerous', desc: '录制音频' },
  { name: 'android.permission.ACCESS_FINE_LOCATION', level: 'dangerous', desc: '精确定位' },
  { name: 'android.permission.ACCESS_COARSE_LOCATION', level: 'dangerous', desc: '模糊定位' },
  { name: 'android.permission.READ_CONTACTS', level: 'dangerous', desc: '读取联系人' },
  { name: 'android.permission.WRITE_CONTACTS', level: 'dangerous', desc: '写入联系人' },
  { name: 'android.permission.READ_PHONE_STATE', level: 'dangerous', desc: '读取手机状态' },
  { name: 'android.permission.CALL_PHONE', level: 'dangerous', desc: '拨打电话' },
  { name: 'android.permission.SEND_SMS', level: 'dangerous', desc: '发送短信' },
  { name: 'android.permission.RECEIVE_SMS', level: 'dangerous', desc: '接收短信' },
  { name: 'android.permission.READ_SMS', level: 'dangerous', desc: '读取短信' },
  { name: 'android.permission.BLUETOOTH', level: 'normal', desc: '使用蓝牙' },
  { name: 'android.permission.BLUETOOTH_ADMIN', level: 'normal', desc: '管理蓝牙' },
  { name: 'android.permission.NFC', level: 'normal', desc: '使用NFC' },
  { name: 'android.permission.VIBRATE', level: 'normal', desc: '使用震动' },
  { name: 'android.permission.WAKE_LOCK', level: 'normal', desc: '保持屏幕常亮' },
  { name: 'android.permission.RECEIVE_BOOT_COMPLETED', level: 'normal', desc: '开机自启' },
  { name: 'android.permission.USE_FINGERPRINT', level: 'normal', desc: '使用指纹' },
  { name: 'android.permission.USE_BIOMETRIC', level: 'normal', desc: '使用生物识别' },
  { name: 'android.permission.FOREGROUND_SERVICE', level: 'normal', desc: '前台服务' },
  { name: 'android.permission.REQUEST_INSTALL_PACKAGES', level: 'signature', desc: '安装应用包' },
  { name: 'android.permission.SYSTEM_ALERT_WINDOW', level: 'signature', desc: '系统悬浮窗' },
  { name: 'android.permission.WRITE_SETTINGS', level: 'signature', desc: '修改系统设置' },
  { name: 'android.permission.MANAGE_EXTERNAL_STORAGE', level: 'dangerous', desc: '管理所有文件' },
  { name: 'android.permission.ACCESS_WIFI_STATE', level: 'normal', desc: '获取Wi-Fi状态' },
  { name: 'android.permission.CHANGE_WIFI_STATE', level: 'normal', desc: '改变Wi-Fi状态' },
  { name: 'android.permission.ACCESS_NETWORK_STATE', level: 'normal', desc: '获取网络状态' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? permissions.filter(i => i.name.toLowerCase().includes(k) || i.desc.includes(k) || i.level.includes(k)) : permissions
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th, .data-table td { padding: 8px 12px; border: 1px solid #d0d7de; text-align: left; }
.data-table th { background: #f6f8fa; font-weight: 600; }
.data-table tr:hover { background: #f0f6ff; }
code { background: #eef1f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; }
.badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.badge.normal { background: #dafbe1; color: #1a7f37; }
.badge.dangerous { background: #ffebe9; color: #cf222e; }
.badge.signature { background: #fff8c5; color: #9a6700; }
</style>

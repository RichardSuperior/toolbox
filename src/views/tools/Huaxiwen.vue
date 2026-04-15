<template>
  <ToolLayout title="火星文转换器">
    <div class="huaxiwen">
      <div class="tool-bar">
        <button class="btn" @click="toHuoxing">简体 → 火星文</button>
        <button class="btn" @click="toJianti">火星文 → 简体</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="输入文字，如：深圳代码蜂巢欢迎您" @input="toHuoxing"></textarea>
        <textarea v-model="output" class="code-area" readonly placeholder="火星文输出..."></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')

const hxMap = {
  '深':'罙','圳':'圠','代':'伐','码':'闯','蜂':'虫封','巢':'朝','您':'恁','深':'罙',
  '我':'莪','你':'倪','他':'祂','她':'祂','它':'祂','们':'闷','这':'适','那':'呐',
  '的':'デ','是':'issei','不':'甭','和':'露','爱':'噯','学':'学','校':'校','家':'嫁',
  '朋':'皃','友':'友','世':'丐','界':'畀','中':'ソ','国':'囯','欢':'劝','迎':'迎',
  '您':'ń','好':'郝','年':'哖','月':'圄','日':'耂','时':'畸','分':'汾','钱':'峹',
  '宝':'室','号':'号','码':'妈','密':'幂','错':'措','请':'請','谢':'射','感':'敢',
  '谢':'射','恭':'共','喜':'嘻','贺':'祸','乐':'楽','马':'妈','到':'刾','去':'呿',
  '来':'莱','是':'si','很':'恨','太':'忦','都':'嘟','想':'상','能':'螈','会':'絵',
  '说':'兌','知':'智','道':'逳','东':'冻','西':'茜','南':'喃','北':'杯','龙':'竜',
  '蛇':'虵','虎':'唬','狗':'沟','猫':'苗','鸡':'姬','鸭':'甲','猪':'粂','牛':'妕',
  '马':'骂','发':'髪','头':'豆','发':'髮','请':'靕','朋':'朋','码':'妈','友':'发',
}

function toHuoxing() {
  let result = ''
  for (const char of input.value) {
    result += hxMap[char] !== undefined ? hxMap[char] : char
  }
  output.value = result
}

function toJianti() {
  const reverseMap = {}
  for (const [k, v] of Object.entries(hxMap)) {
    if (!reverseMap[v]) reverseMap[v] = k
  }
  let result = ''
  for (const char of input.value) {
    result += reverseMap[char] !== undefined ? reverseMap[char] : char
  }
  output.value = result
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.huaxiwen { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 250px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>

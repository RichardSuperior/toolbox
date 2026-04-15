<template>
  <ToolLayout title="简繁体转换" subtitle="中文简体与繁体字符双向互相转换" icon="🈶">
    <div class="card p-6">
      <!-- 方向选择 -->
      <div class="flex items-center gap-3 mb-5">
        <div class="flex bg-[var(--bg-secondary)] rounded-lg p-1 text-sm">
          <button @click="direction = 's2t'" :class="direction==='s2t' ? 'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'" class="px-4 py-1.5 rounded-md font-medium transition-all">简 → 繁</button>
          <button @click="direction = 't2s'" :class="direction==='t2s' ? 'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'" class="px-4 py-1.5 rounded-md font-medium transition-all">繁 → 简</button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="flex justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span>{{ direction === 's2t' ? '简体中文' : '繁体中文' }}</span>
            <span>{{ input.length }} 字</span>
          </label>
          <textarea v-model="input" :placeholder="direction === 's2t' ? '输入简体中文...' : '輸入繁體中文...'" class="input-base h-52"></textarea>
        </div>
        <div>
          <label class="flex justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span>{{ direction === 's2t' ? '繁体中文' : '简体中文' }}</span>
            <span>{{ output.length }} 字</span>
          </label>
          <textarea :value="output" readonly class="input-base h-52"></textarea>
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button @click="copyOutput" class="btn-primary">复制结果</button>
        <button @click="swapIO" class="btn-secondary">交换</button>
        <button @click="input = ''" class="btn-ghost">清空</button>
      </div>
    </div>

    <template #knowledge>
      <p class="text-sm text-[var(--text-secondary)]">本工具基于常见简繁对照表进行字符级映射转换，适用于日常文本的简繁体互换。由于部分字存在一对多的对应关系，批量处理时建议人工审阅结果。</p>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const direction = ref('s2t')
const input = ref('')

// 简繁对照表（精简版，实际可扩展）
const S2T = { '爱':'愛','办':'辦','报':'報','宝':'寶','贝':'貝','边':'邊','变':'變','标':'標','别':'別','补':'補','财':'財','产':'產','长':'長','尝':'嚐','车':'車','称':'稱','齿':'齒','冲':'衝','处':'處','传':'傳','错':'錯','达':'達','带':'帶','担':'擔','当':'當','导':'導','灯':'燈','电':'電','点':'點','动':'動','东':'東','读':'讀','对':'對','发':'發','费':'費','风':'風','复':'複','该':'該','盖':'蓋','个':'個','给':'給','广':'廣','国':'國','汉':'漢','号':'號','合':'合','华':'華','还':'還','话':'話','货':'貨','机':'機','际':'際','价':'價','见':'見','将':'將','奖':'獎','结':'結','进':'進','经':'經','开':'開','来':'來','乐':'樂','里':'裡','历':'歷','练':'練','两':'兩','买':'買','满':'滿','门':'門','面':'面','灭':'滅','难':'難','农':'農','拟':'擬','气':'氣','钱':'錢','强':'強','亲':'親','请':'請','确':'確','让':'讓','热':'熱','认':'認','闰':'潤','说':'說','时':'時','书':'書','树':'樹','双':'雙','岁':'歲','随':'隨','体':'體','铁':'鐵','听':'聽','头':'頭','图':'圖','为':'為','无':'無','务':'務','习':'習','现':'現','线':'線','乡':'鄉','写':'寫','学':'學','样':'樣','业':'業','义':'義','应':'應','鱼':'魚','与':'與','语':'語','远':'遠','运':'運','战':'戰','这':'這','针':'針','政':'政','证':'證','志':'誌','中':'中','众':'眾','转':'轉','专':'專','总':'總' }
const T2S = Object.fromEntries(Object.entries(S2T).map(([k,v]) => [v,k]))

const output = computed(() => {
  if (!input.value) return ''
  const map = direction.value === 's2t' ? S2T : T2S
  return input.value.split('').map(ch => map[ch] || ch).join('')
})

async function copyOutput() {
  if (output.value) await navigator.clipboard.writeText(output.value)
}

function swapIO() {
  const out = output.value
  direction.value = direction.value === 's2t' ? 't2s' : 's2t'
  input.value = out
}
</script>

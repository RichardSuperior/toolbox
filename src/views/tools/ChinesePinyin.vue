<template>
  <ToolLayout title="汉字转拼音">
    <div class="pinyin">
      <div class="tool-bar">
        <button class="btn" @click="convert">转换为拼音</button>
        <label class="check-label"><input type="checkbox" v-model="firstLetterOnly" /> 仅首字母</label>
        <label class="check-label"><input type="checkbox" v-model="uppercase" /> 大写</label>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="输入汉字，如：深圳代码蜂巢" @input="convert"></textarea>
        <textarea v-model="output" class="code-area" readonly></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
const firstLetterOnly = ref(false), uppercase = ref(false)

// 常用汉字拼音表（收录常用字，可按需扩展）
const pinyinMap = {
  '深':'shen','圳':'zhen','代':'dai','码':'ma','蜂':'feng','巢':'chao',
  '深':'shen','圳':'zhen','代':'dai','码':'ma','蜂':'feng','巢':'chao',
  '你':'ni','好':'hao','世':'shi','界':'jie','中':'zhong','国':'guo',
  '我':'wo','是':'shi','一':'yi','个':'ge','人':'ren','在':'zai','有':'you',
  '为':'wei','了':'le','不':'bu','他':'ta','她':'ta','它':'ta','们':'men',
  '这':'zhe','那':'na','的':'de','和':'he','与':'yu','或':'huo','而':'er',
  '爱':'ai','恨':'hen','喜':'xi','欢':'huan','学':'xue','习':'xi','工':'gong',
  '作':'zuo','生':'sheng','活':'huo','学':'xue','校':'xiao','家':'jia',
  '朋':'peng','友':'you','同':'tong','事':'shi','老':'lao','师':'shi',
  '学':'xue','生':'sheng','程':'cheng','序':'xu','员':'yuan','开':'kai',
  '发':'fa','设':'she','计':'ji','测':'ce','试':'shi','维':'wei','护':'hu',
  '北':'bei','上':'shang','广':'guang','州':'zhou','深':'shhen','圳':'zhen',
  '成':'cheng','都':'dou','重':'zhong','庆':'qing','西':'xi','安':'an',
  '武':'wu','汉':'han','南':'nan','京':'jing','苏':'su','州':'zhou',
  '杭':'hang','州':'zhou','天':'tian','津':'jin','香':'xiang','港':'gang',
  '澳':'ao','门':'men','台':'tai','北':'bei','北':'bei','京':'jing',
  '河':'he','流':'liu','域':'yu','数':'shu','据':'ju','库':'ku','网':'wang',
  '页':'ye','网':'wang','站':'zhan','应':'ying','用':'yong','程':'cheng',
  '软':'ruan','件':'jian','系':'xi','统':'tong','云':'yun','计':'ji','算':'suan',
  '智':'zhi','能':'neng','机':'ji','器':'qi','学':'xue','习':'xi','深':'shen',
  '深':'shen','度':'du','学':'xue','习':'xi','机':'ji','器':'qi','翻':'fan',
  '译':'yi','文':'wen','本':'ben','图':'tu','片':'pian','音':'yin','视':'shi',
  '频':'pin','音':'yin','乐':'yue','文':'wen','件':'jian','下':'xia','载':'zai',
  '上':'shang','传':'chuan','下':'xia','载':'zai','连':'lian','接':'jie',
  '点':'dian','击':'ji','输':'shu','入':'ru','搜':'sou','索':'suo','查':'cha',
  '找':'zhao','修':'xiu','改':'gai','删':'shan','除':'chu','新':'xin','增':'zeng',
  '编':'bian','辑':'ji','创':'chuang','建':'jian','打':'da','开':'kai','保':'bao',
  '存':'cun','取':'qu','消':'xiao','确':'que','认':'ren','取':'qu','消':'xiao',
  '关':'guan','闭':'bi','最':'zui','近':'jin','今':'jin','天':'tian','昨':'zuo',
  '天':'tian','明':'ming','天':'tian','星':'xing','期':'qi','一':'yi','二':'er',
  '三':'san','四':'si','五':'wu','六':'liu','七':'qi','八':'ba','九':'jiu',
  '十':'shi','月':'yue','日':'ri','时':'shi','分':'fen','秒':'miao','年':'nian',
  '号':'hao','支':'zhi','付':'fu','微':'wei','信':'xin','支':'zhi','宝':'bao',
  '银':'yin','行':'hang','卡':'ka','号':'hao','余':'yu','额':'e','余':'yu',
  '额':'e','请':'qing','输':'shu','入':'ru','知':'zhi','识':'shi','认':'ren',
  '识':'shi','问':'wen','题':'ti','欢':'huan','迎':'ying','访':'fang','问':'wen',
  '网':'wang','址':'zhi','码':'ma','验':'yan','码':'ma','登':'deng','录':'lu',
  '账':'zhang','号':'hao','密':'mi','码':'ma','确':'que','认':'ren','同':'tong',
  '意':'yi','接':'jie','受':'shou','同':'tong','意':'yi','赞':'zan','赏':'shang',
  '评':'ping','论':'lun','收':'shou','藏':'cang','关':'guan','注':'zhu','分':'fen',
  '享':'xiang','转':'zhuan','发':'fa','复':'fu','制':'zhi','粘':'nian','贴':'tie',
  '剪':'jian','切':'qie','撤':'che','销':'xiao','撤':'che','回':'hui','前':'qian',
  '后':'hou','首':'shou','页':'ye','菜':'cai','单':'dan','工':'gong','具':'ju',
  '设':'she','置':'zhi','更':'geng','新':'xin','删':'shan','除':'chu','名':'ming',
  '字':'zi','拼':'pin','音':'yin','转':'zhuan','换':'huan','器':'qi','简':'jian',
  '繁':'fan','输':'shu','入':'ru','内':'nei','容':'rong','播':'bo','放':'fang',
}

function convert() {
  if (!input.value) { output.value = ''; return }
  let result = ''
  for (const char of input.value) {
    if (pinyinMap[char]) {
      let p = firstLetterOnly.value ? pinyinMap[char][0] : pinyinMap[char]
      result += uppercase.value ? p.toUpperCase() : p
    } else {
      result += char
    }
  }
  output.value = result
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.pinyin { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.check-label { display: flex; align-items: center; gap: 4px; font-size: 13px; cursor: pointer; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 250px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>

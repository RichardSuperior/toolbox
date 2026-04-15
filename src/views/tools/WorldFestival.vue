<template>
  <ToolLayout title="世界节日查询">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索节日名称或日期..." />
        <select v-model="region" class="region-select">
          <option value="">全部地区</option>
          <option value="中国">中国</option>
          <option value="国际">国际</option>
          <option value="西方">西方</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div class="festivals-grid">
        <div v-for="f in filtered" :key="f.name" class="festival-card">
          <div class="festival-icon">{{ f.icon }}</div>
          <div class="festival-info">
            <div class="festival-name">{{ f.name }}</div>
            <div class="festival-date">📅 {{ f.date }}</div>
            <div class="festival-region">🌍 {{ f.region }}</div>
            <div class="festival-desc">{{ f.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref(''), region = ref('')
const festivals = [
  { icon: '🎊', name: '元旦', date: '1月1日', region: '国际', desc: '公历新年，大多数国家的法定假日' },
  { icon: '🧨', name: '春节', date: '农历正月初一', region: '中国', desc: '中国最重要的传统节日，农历新年' },
  { icon: '💝', name: '情人节', date: '2月14日', region: '西方', desc: '恋人间互赠礼物表达爱意的节日' },
  { icon: '🌸', name: '元宵节', date: '农历正月十五', region: '中国', desc: '赏花灯、吃汤圆，庆祝春节的最后一天' },
  { icon: '🌿', name: '清明节', date: '公历4月4-6日', region: '中国', desc: '扫墓祭祖、踏青的传统节日' },
  { icon: '🐣', name: '复活节', date: '春分后第一个满月后的周日', region: '西方', desc: '基督教纪念耶稣复活的节日' },
  { icon: '👩', name: '妇女节', date: '3月8日', region: '国际', desc: '国际劳动妇女节，纪念妇女权利运动' },
  { icon: '🌲', name: '植树节', date: '3月12日', region: '中国', desc: '中国植树造林、绿化祖国的节日' },
  { icon: '🌍', name: '地球日', date: '4月22日', region: '国际', desc: '提倡保护地球环境的国际节日' },
  { icon: '🌹', name: '劳动节', date: '5月1日', region: '国际', desc: '国际劳动节，工人阶级的节日' },
  { icon: '👶', name: '儿童节', date: '6月1日', region: '国际', desc: '国际儿童节，保护儿童权利的节日' },
  { icon: '🐉', name: '端午节', date: '农历五月初五', region: '中国', desc: '纪念屈原，赛龙舟、吃粽子的传统节日' },
  { icon: '🎆', name: '国庆节', date: '10月1日', region: '中国', desc: '中华人民共和国成立纪念日' },
  { icon: '🎑', name: '中秋节', date: '农历八月十五', region: '中国', desc: '赏月吃月饼，象征团圆的传统节日' },
  { icon: '🎃', name: '万圣节', date: '10月31日', region: '西方', desc: '西方传统节日，装扮鬼怪讨糖果' },
  { icon: '🦃', name: '感恩节', date: '11月第四个周四', region: '西方', desc: '美国家庭团聚、感恩的节日' },
  { icon: '🎅', name: '圣诞节', date: '12月25日', region: '西方', desc: '基督教纪念耶稣诞生的节日' },
  { icon: '🎇', name: '元旦前夕', date: '12月31日', region: '国际', desc: '跨年夜，迎接新年的节日' },
  { icon: '🌙', name: '开斋节', date: '伊斯兰历肖旺月1日', region: '其他', desc: '穆斯林斋月结束的庆祝节日' },
  { icon: '🕌', name: '宰牲节', date: '伊斯兰历都尔黑哲月10日', region: '其他', desc: '伊斯兰教重要节日，纪念易卜拉欣献祭' },
  { icon: '🕯️', name: '光明节', date: '犹太历基斯流月25日', region: '其他', desc: '犹太人的光明节，持续八天' },
  { icon: '🎆', name: '排灯节', date: '印度历卡尔提卡月', region: '其他', desc: '印度教光明节，彩灯庆祝邪不胜正' },
  { icon: '🌺', name: '七夕节', date: '农历七月初七', region: '中国', desc: '中国传统情人节，牛郎织女相会' },
  { icon: '👻', name: '中元节', date: '农历七月十五', region: '中国', desc: '祭祀祖先和亡灵的传统节日' },
  { icon: '❄️', name: '冬至', date: '公历12月21-23日', region: '中国', desc: '中国传统节气，北半球白天最短的一天' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  const r = region.value
  return festivals.filter(f =>
    (!k || f.name.includes(k) || f.date.includes(k) || f.desc.includes(k)) &&
    (!r || f.region === r)
  )
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.region-select { padding: 8px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; }
.festivals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }
.festival-card { display: flex; gap: 12px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; }
.festival-icon { font-size: 32px; flex-shrink: 0; }
.festival-name { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
.festival-date, .festival-region { font-size: 12px; color: #666; margin-bottom: 2px; }
.festival-desc { font-size: 13px; color: #444; margin-top: 4px; line-height: 1.4; }
</style>

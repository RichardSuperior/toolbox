<template>
  <ToolLayout title="中国历代王朝">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索朝代名称..." />
      </div>
      <div class="timeline">
        <div v-for="item in filtered" :key="item.name" class="dynasty-card">
          <div class="dynasty-header">
            <span class="dynasty-name">{{ item.name }}</span>
            <span class="dynasty-period">{{ item.period }}</span>
            <span class="dynasty-years">{{ item.years }}年</span>
          </div>
          <div class="dynasty-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const dynasties = [
  { name: '夏', period: '约前2070—前1600年', years: '约470', desc: '中国史书记载的第一个世袭制朝代，禹建立，都阳城（今河南禹州）。' },
  { name: '商', period: '约前1600—前1046年', years: '约554', desc: '又称殷商，甲骨文发现于此时期，青铜器发达，都殷（今河南安阳）。' },
  { name: '西周', period: '前1046—前771年', years: '约275', desc: '周武王伐纣建立，实行封建制度，礼乐文明兴盛，都镐京（今西安）。' },
  { name: '东周（春秋）', period: '前770—前476年', years: '295', desc: '周平王东迁，诸侯争霸，孔子、老子等诸子百家涌现。' },
  { name: '东周（战国）', period: '前475—前221年', years: '254', desc: '七雄争霸，商鞅变法，最终秦统一六国。' },
  { name: '秦', period: '前221—前207年', years: '14', desc: '嬴政建立，首个大一统封建王朝，统一文字、度量衡，修长城。' },
  { name: '西汉', period: '前202—8年', years: '210', desc: '刘邦建立，丝绸之路开通，文景之治、汉武盛世，国力鼎盛。' },
  { name: '新朝', period: '9—23年', years: '15', desc: '王莽篡汉建立，改革失败，历时短暂。' },
  { name: '东汉', period: '25—220年', years: '195', desc: '刘秀（光武帝）建立，造纸术、地动仪发明，都洛阳。' },
  { name: '三国（魏蜀吴）', period: '220—280年', years: '60', desc: '曹魏、蜀汉、东吴三足鼎立，《三国演义》即取材于此。' },
  { name: '西晋', period: '265—316年', years: '51', desc: '司马炎建立，短暂统一后爆发八王之乱。' },
  { name: '东晋', period: '317—420年', years: '103', desc: '偏安江南，王谢家族名盛一时，书圣王羲之活跃于此。' },
  { name: '南北朝', period: '420—589年', years: '169', desc: '南朝（宋齐梁陈）与北朝（北魏等）并立，民族融合。' },
  { name: '隋', period: '581—618年', years: '37', desc: '杨坚建立，开凿大运河，创科举制，二世而亡。' },
  { name: '唐', period: '618—907年', years: '289', desc: '李渊建立，贞观之治、开元盛世，诗歌文化鼎盛，长安为国际都市。' },
  { name: '五代十国', period: '907—960年', years: '53', desc: '唐末藩镇割据，中原五代更迭，南方十国并立。' },
  { name: '北宋', period: '960—1127年', years: '167', desc: '赵匡胤建立，经济文化高度发展，指南针、活字印刷广泛应用。' },
  { name: '南宋', period: '1127—1279年', years: '152', desc: '偏安江南，临安（今杭州）为都，文化艺术繁荣。' },
  { name: '辽', period: '916—1125年', years: '209', desc: '契丹族建立，与北宋并立，澶渊之盟后维持和平。' },
  { name: '金', period: '1115—1234年', years: '119', desc: '女真族建立，灭辽灭北宋，与南宋对峙。' },
  { name: '元', period: '1271—1368年', years: '97', desc: '忽必烈建立，疆域空前广阔，马可·波罗来华，大都（今北京）为都。' },
  { name: '明', period: '1368—1644年', years: '276', desc: '朱元璋建立，郑和下西洋，建故宫，万里长城修缮完善。' },
  { name: '清', period: '1644—1912年', years: '268', desc: '满族爱新觉罗氏建立，康乾盛世后逐渐衰落，辛亥革命后灭亡。' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? dynasties.filter(d => d.name.includes(k) || d.period.includes(k) || d.desc.includes(k)) : dynasties
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.timeline { display: flex; flex-direction: column; gap: 8px; }
.dynasty-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px 16px; border-left: 4px solid #0969da; }
.dynasty-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; flex-wrap: wrap; }
.dynasty-name { font-weight: 700; font-size: 16px; color: #0969da; }
.dynasty-period { font-size: 13px; color: #555; }
.dynasty-years { font-size: 12px; background: #ddf4ff; color: #0550ae; padding: 2px 8px; border-radius: 10px; }
.dynasty-desc { font-size: 13px; color: #444; line-height: 1.6; }
</style>

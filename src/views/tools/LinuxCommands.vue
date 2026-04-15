<template>
  <ToolLayout title="Linux 命令速查">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索命令名称或说明..." />
        <div class="category-tabs">
          <button v-for="cat in categories" :key="cat" class="cat-tab" :class="{ active: activeCat === cat }" @click="activeCat = cat">{{ cat }}</button>
        </div>
      </div>
      <div class="cmd-grid">
        <div v-for="cmd in filtered" :key="cmd.name" class="cmd-card" @click="selected = cmd">
          <code class="cmd-name">{{ cmd.name }}</code>
          <div class="cmd-brief">{{ cmd.brief }}</div>
        </div>
      </div>
      <div v-if="selected" class="detail-panel">
        <div class="detail-header">
          <code class="detail-name">{{ selected.name }}</code>
          <button class="close-btn" @click="selected = null">✕</button>
        </div>
        <div class="detail-desc">{{ selected.desc }}</div>
        <div class="examples">
          <div class="examples-title">常用示例：</div>
          <div v-for="ex in selected.examples" :key="ex" class="example-item">
            <code>{{ ex }}</code>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref(''), activeCat = ref('全部'), selected = ref(null)
const categories = ['全部', '文件操作', '文本处理', '进程管理', '网络', '系统信息', '权限', '压缩']
const commands = [
  { cat: '文件操作', name: 'ls', brief: '列出目录内容', desc: '列出目录中的文件和子目录', examples: ['ls -la', 'ls -lh /home', 'ls -R'] },
  { cat: '文件操作', name: 'cd', brief: '切换目录', desc: '改变当前工作目录', examples: ['cd /home/user', 'cd ..', 'cd ~', 'cd -'] },
  { cat: '文件操作', name: 'cp', brief: '复制文件/目录', desc: '复制文件或目录到指定位置', examples: ['cp file.txt /tmp/', 'cp -r dir/ /tmp/', 'cp -p src dst'] },
  { cat: '文件操作', name: 'mv', brief: '移动/重命名', desc: '移动或重命名文件和目录', examples: ['mv old.txt new.txt', 'mv file.txt /tmp/', 'mv -i src dst'] },
  { cat: '文件操作', name: 'rm', brief: '删除文件', desc: '删除文件或目录（谨慎使用）', examples: ['rm file.txt', 'rm -rf dir/', 'rm -i *.log'] },
  { cat: '文件操作', name: 'mkdir', brief: '创建目录', desc: '创建新目录', examples: ['mkdir mydir', 'mkdir -p a/b/c', 'mkdir -m 755 dir'] },
  { cat: '文件操作', name: 'find', brief: '查找文件', desc: '在目录树中搜索文件', examples: ['find . -name "*.txt"', 'find /home -size +100M', 'find . -mtime -7'] },
  { cat: '文件操作', name: 'chmod', brief: '修改权限', desc: '更改文件或目录的权限', examples: ['chmod 755 file', 'chmod +x script.sh', 'chmod -R 644 dir/'] },
  { cat: '文本处理', name: 'cat', brief: '查看文件内容', desc: '连接并输出文件内容', examples: ['cat file.txt', 'cat -n file.txt', 'cat file1 file2 > merged'] },
  { cat: '文本处理', name: 'grep', brief: '文本搜索', desc: '使用正则表达式搜索文本', examples: ['grep "error" log.txt', 'grep -ri "todo" .', 'grep -v "^#" config'] },
  { cat: '文本处理', name: 'sed', brief: '流编辑器', desc: '对文本进行替换、删除等操作', examples: ["sed 's/old/new/g' file", "sed -n '1,5p' file", "sed '/^$/d' file"] },
  { cat: '文本处理', name: 'awk', brief: '文本分析工具', desc: '强大的文本处理和分析工具', examples: ["awk '{print $1}' file", "awk -F: '{print $1}' /etc/passwd", "awk 'NR>1' file"] },
  { cat: '文本处理', name: 'tail', brief: '查看文件尾部', desc: '输出文件末尾部分', examples: ['tail -n 20 log', 'tail -f /var/log/syslog', 'tail -c 100 file'] },
  { cat: '文本处理', name: 'head', brief: '查看文件头部', desc: '输出文件开头部分', examples: ['head -n 10 file', 'head -c 200 file'] },
  { cat: '文本处理', name: 'wc', brief: '统计字数', desc: '统计文件的行数、字数、字节数', examples: ['wc -l file', 'wc -w file', 'wc -c file'] },
  { cat: '进程管理', name: 'ps', brief: '查看进程', desc: '显示当前运行的进程信息', examples: ['ps aux', 'ps -ef | grep nginx', 'ps -p 1234'] },
  { cat: '进程管理', name: 'kill', brief: '终止进程', desc: '向进程发送信号', examples: ['kill 1234', 'kill -9 1234', 'kill -TERM $(pgrep nginx)'] },
  { cat: '进程管理', name: 'top', brief: '实时进程监控', desc: '动态显示系统运行进程', examples: ['top', 'top -u username', 'top -p 1234'] },
  { cat: '进程管理', name: 'nohup', brief: '后台运行', desc: '在后台运行命令，忽略挂起信号', examples: ['nohup ./script.sh &', 'nohup python app.py > out.log 2>&1 &'] },
  { cat: '网络', name: 'curl', brief: 'HTTP 请求', desc: '传输数据的命令行工具', examples: ['curl https://example.com', 'curl -I url', 'curl -X POST -d data url'] },
  { cat: '网络', name: 'wget', brief: '下载文件', desc: '从网络下载文件', examples: ['wget https://url/file', 'wget -O name.zip url', 'wget -r -np url'] },
  { cat: '网络', name: 'ping', brief: '测试连通性', desc: '测试网络连接是否正常', examples: ['ping google.com', 'ping -c 5 host', 'ping -i 2 host'] },
  { cat: '网络', name: 'ssh', brief: '远程登录', desc: '安全地连接到远程主机', examples: ['ssh user@host', 'ssh -p 2222 user@host', 'ssh -i key.pem user@host'] },
  { cat: '网络', name: 'netstat', brief: '网络连接状态', desc: '显示网络连接、路由表等信息', examples: ['netstat -tulnp', 'netstat -an | grep LISTEN', 'netstat -r'] },
  { cat: '系统信息', name: 'df', brief: '磁盘使用', desc: '显示磁盘空间使用情况', examples: ['df -h', 'df -T', 'df /home'] },
  { cat: '系统信息', name: 'du', brief: '目录大小', desc: '估算文件和目录的磁盘使用', examples: ['du -sh *', 'du -sh /var/log', 'du -h --max-depth=1'] },
  { cat: '系统信息', name: 'free', brief: '内存使用', desc: '显示内存使用情况', examples: ['free -h', 'free -m', 'free -s 2'] },
  { cat: '系统信息', name: 'uname', brief: '系统信息', desc: '显示系统和内核信息', examples: ['uname -a', 'uname -r', 'uname -m'] },
  { cat: '权限', name: 'sudo', brief: '超级用户执行', desc: '以超级用户或其他用户身份执行命令', examples: ['sudo apt update', 'sudo -u user cmd', 'sudo su -'] },
  { cat: '权限', name: 'chown', brief: '修改所有者', desc: '更改文件或目录的所有者', examples: ['chown user file', 'chown user:group file', 'chown -R user:group dir/'] },
  { cat: '压缩', name: 'tar', brief: '归档和压缩', desc: '打包和解包文件', examples: ['tar -czvf archive.tar.gz dir/', 'tar -xzvf archive.tar.gz', 'tar -tvf archive.tar.gz'] },
  { cat: '压缩', name: 'zip', brief: 'ZIP 压缩', desc: '压缩文件为 ZIP 格式', examples: ['zip -r output.zip dir/', 'zip output.zip file1 file2', 'unzip archive.zip'] },
  { cat: '压缩', name: 'gzip', brief: 'Gzip 压缩', desc: '使用 gzip 算法压缩文件', examples: ['gzip file', 'gzip -d file.gz', 'gzip -c file > file.gz'] },
]
const filtered = computed(() => {
  let list = activeCat.value === '全部' ? commands : commands.filter(c => c.cat === activeCat.value)
  if (keyword.value) {
    const k = keyword.value.toLowerCase()
    list = list.filter(c => c.name.includes(k) || c.brief.includes(k) || c.desc.includes(k))
  }
  return list
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-bar { display: flex; flex-direction: column; gap: 8px; }
.search-input { padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.category-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-tab { padding: 5px 12px; border: 1px solid #d0d7de; border-radius: 20px; background: white; cursor: pointer; font-size: 13px; }
.cat-tab.active { background: #0969da; color: white; border-color: #0969da; }
.cmd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.cmd-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.15s; }
.cmd-card:hover { background: #f0f6ff; border-color: #0969da; }
.cmd-name { font-size: 15px; font-weight: 700; color: #0969da; font-family: monospace; }
.cmd-brief { font-size: 12px; color: #666; margin-top: 4px; }
.detail-panel { background: #f6f8fa; border: 2px solid #0969da; border-radius: 10px; padding: 16px; }
.detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.detail-name { font-size: 20px; font-weight: 700; color: #0969da; }
.close-btn { background: none; border: none; cursor: pointer; font-size: 16px; color: #666; }
.detail-desc { font-size: 14px; margin-bottom: 12px; }
.examples-title { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.example-item { margin: 4px 0; }
.example-item code { background: #1e1e1e; color: #d4d4d4; padding: 6px 12px; border-radius: 6px; font-size: 13px; display: block; font-family: 'Fira Code', monospace; }
</style>

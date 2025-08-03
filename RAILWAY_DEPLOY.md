# Railway 部署指南

## 🚀 快速部署

### 1. 准备工作

确保你的项目已经准备好部署：

```bash
# 运行部署检查
npm run railway:check
```

### 2. 安装 Railway CLI

```bash
npm install -g @railway/cli
```

### 3. 登录 Railway

```bash
railway login
```

### 4. 初始化项目

```bash
railway init
```

### 5. 部署项目

```bash
railway up
```

## 📋 必需的环境变量

在 Railway 控制台中设置以下环境变量：

### 基础配置
- `NODE_ENV`: `production`
- `PORT`: `3000` (Railway会自动设置)

### 数据库配置（可选）
- `MONGODB_URI`: MongoDB连接字符串
  - 格式: `mongodb+srv://username:password@cluster.mongodb.net/database`
  - 如果不设置，将使用内存存储

### 安全配置（可选）
- `ALLOWED_ORIGINS`: 允许的CORS域名
  - 默认: `*` (允许所有域名)
  - 建议: 设置为你的域名，如 `https://your-app.railway.app`

## 🔧 部署配置

### railway.toml
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
healthcheckPath = "/health"
healthcheckTimeout = 300

[env]
NODE_ENV = "production"
PORT = "3000"
RAILWAY_HEALTH_CHECK_PATH = "/health"
```

### package.json
```json
{
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js",
    "build": "echo 'No build step needed for static files'",
    "postinstall": "cd server && npm install",
    "railway:check": "node railway-check.js",
    "railway:deploy": "railway up"
  }
}
```

## 🏥 健康检查

部署后，可以通过以下端点检查服务状态：

- **健康检查**: `https://your-app.railway.app/health`
- **API健康检查**: `https://your-app.railway.app/api/health`

健康检查响应示例：
```json
{
  "status": "ok",
  "service": "vibe-meeting",
  "timestamp": "2025-08-03T06:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

## 🔍 故障排除

### 常见问题

1. **部署失败**
   - 检查 `railway.toml` 配置
   - 确认 `package.json` 中的 `start` 脚本
   - 查看部署日志

2. **服务无法启动**
   - 检查环境变量设置
   - 确认端口配置
   - 查看应用日志

3. **静态文件无法访问**
   - 确认 `index.html` 在根目录
   - 检查服务器静态文件配置

4. **WebSocket连接失败**
   - 确认 Socket.IO 配置
   - 检查 CORS 设置
   - 验证客户端连接URL

### 调试命令

```bash
# 查看部署日志
railway logs

# 查看服务状态
railway status

# 重启服务
railway restart

# 查看环境变量
railway variables
```

## 📊 监控和维护

### 性能监控
- Railway 提供内置的性能监控
- 可以通过 `/health` 端点监控服务状态
- 建议设置告警通知

### 日志管理
- 使用 `railway logs` 查看实时日志
- 日志会自动轮转，无需手动管理
- 建议定期检查错误日志

### 数据库维护
- 如果使用 MongoDB，定期备份数据
- 监控数据库连接状态
- 设置数据库告警

## 🔄 更新部署

### 自动部署
- 连接 GitHub 仓库实现自动部署
- 每次推送代码到主分支时自动部署
- 可以在 Railway 控制台配置部署规则

### 手动部署
```bash
# 部署最新代码
railway up

# 部署特定分支
railway up --branch feature-branch
```

## 🛡️ 安全建议

1. **环境变量**
   - 不要在代码中硬编码敏感信息
   - 使用 Railway 的环境变量功能
   - 定期轮换密钥和密码

2. **CORS 配置**
   - 限制允许的域名
   - 避免使用 `*` 作为 CORS 策略
   - 定期审查 CORS 设置

3. **HTTPS**
   - Railway 自动提供 HTTPS
   - 确保客户端使用 HTTPS 连接
   - 检查证书有效性

## 📞 支持

如果遇到部署问题：

1. 查看 [Railway 文档](https://docs.railway.app/)
2. 检查项目日志
3. 运行 `npm run railway:check` 诊断问题
4. 联系 Railway 支持团队

## 🎯 最佳实践

1. **代码质量**
   - 在部署前运行测试
   - 使用 ESLint 检查代码质量
   - 确保没有语法错误

2. **性能优化**
   - 压缩静态文件
   - 使用 CDN 加速
   - 优化数据库查询

3. **监控告警**
   - 设置服务可用性监控
   - 配置错误率告警
   - 监控响应时间

4. **备份策略**
   - 定期备份数据库
   - 保存重要配置文件
   - 建立恢复流程

---

**注意**: 本指南适用于 Vibe Meeting 项目的 Railway 部署。如有疑问，请参考 Railway 官方文档或联系项目维护者。
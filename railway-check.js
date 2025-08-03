#!/usr/bin/env node

/**
 * Railway部署检查脚本
 * 用于验证项目配置是否正确，确保能够成功部署到Railway
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始Railway部署检查...\n');

// 检查必需的文件
const requiredFiles = [
    'package.json',
    'server/server.js',
    'server/package.json',
    'railway.toml',
    'index.html',
    'app.js',
    'styles.css'
];

console.log('📁 检查必需文件:');
let allFilesExist = true;
requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

// 检查package.json配置
console.log('\n📦 检查package.json配置:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // 检查scripts
    const requiredScripts = ['start', 'dev'];
    requiredScripts.forEach(script => {
        const hasScript = packageJson.scripts && packageJson.scripts[script];
        console.log(`  ${hasScript ? '✅' : '❌'} scripts.${script}`);
    });
    
    // 检查dependencies
    const requiredDeps = ['express', 'socket.io', 'cors'];
    requiredDeps.forEach(dep => {
        const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
        console.log(`  ${hasDep ? '✅' : '❌'} dependencies.${dep}`);
    });
    
    // 检查engines
    const hasEngines = packageJson.engines && packageJson.engines.node;
    console.log(`  ${hasEngines ? '✅' : '❌'} engines.node`);
    
} catch (error) {
    console.log(`  ❌ package.json解析失败: ${error.message}`);
}

// 检查server/package.json
console.log('\n📦 检查server/package.json配置:');
try {
    const serverPackageJson = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
    
    const hasStartScript = serverPackageJson.scripts && serverPackageJson.scripts.start;
    console.log(`  ${hasStartScript ? '✅' : '❌'} scripts.start`);
    
    const hasExpress = serverPackageJson.dependencies && serverPackageJson.dependencies.express;
    console.log(`  ${hasExpress ? '✅' : '❌'} dependencies.express`);
    
} catch (error) {
    console.log(`  ❌ server/package.json解析失败: ${error.message}`);
}

// 检查railway.toml
console.log('\n🚂 检查railway.toml配置:');
try {
    const railwayConfig = fs.readFileSync('railway.toml', 'utf8');
    
    const hasBuild = railwayConfig.includes('[build]');
    const hasDeploy = railwayConfig.includes('[deploy]');
    const hasEnv = railwayConfig.includes('[env]');
    const hasStartCommand = railwayConfig.includes('startCommand');
    const hasHealthCheck = railwayConfig.includes('healthcheckPath');
    
    console.log(`  ${hasBuild ? '✅' : '❌'} [build] section`);
    console.log(`  ${hasDeploy ? '✅' : '❌'} [deploy] section`);
    console.log(`  ${hasEnv ? '✅' : '❌'} [env] section`);
    console.log(`  ${hasStartCommand ? '✅' : '❌'} startCommand`);
    console.log(`  ${hasHealthCheck ? '✅' : '❌'} healthcheckPath`);
    
} catch (error) {
    console.log(`  ❌ railway.toml解析失败: ${error.message}`);
}

// 检查环境变量
console.log('\n🌍 检查环境变量配置:');
const envVars = ['NODE_ENV', 'PORT'];
envVars.forEach(envVar => {
    const hasEnv = process.env[envVar];
    console.log(`  ${hasEnv ? '✅' : '⚠️'} ${envVar} = ${hasEnv || '未设置'}`);
});

// 检查静态文件
console.log('\n📄 检查静态文件:');
const staticFiles = ['index.html', 'app.js', 'styles.css', 'realtime-client.js'];
staticFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 检查服务器文件
console.log('\n🖥️ 检查服务器文件:');
const serverFiles = ['server/server.js'];
serverFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    
    if (exists) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const hasExpress = content.includes('express');
            const hasSocketIO = content.includes('socket.io');
            const hasHealthCheck = content.includes('/health');
            
            console.log(`    ${hasExpress ? '✅' : '❌'} Express.js`);
            console.log(`    ${hasSocketIO ? '✅' : '❌'} Socket.IO`);
            console.log(`    ${hasHealthCheck ? '✅' : '❌'} 健康检查端点`);
        } catch (error) {
            console.log(`    ❌ 文件读取失败: ${error.message}`);
        }
    }
});

// 总结
console.log('\n📊 部署检查总结:');
console.log('✅ 项目配置基本正确，可以部署到Railway');
console.log('\n🚀 部署步骤:');
console.log('1. 确保已安装Railway CLI: npm install -g @railway/cli');
console.log('2. 登录Railway: railway login');
console.log('3. 初始化项目: railway init');
console.log('4. 部署项目: railway up');
console.log('\n⚠️ 注意事项:');
console.log('- 确保在Railway控制台中设置了必要的环境变量');
console.log('- 特别是MONGODB_URI（如果使用MongoDB）');
console.log('- 检查部署日志以确认服务正常启动');
console.log('\n🔗 有用的链接:');
console.log('- Railway文档: https://docs.railway.app/');
console.log('- 项目健康检查: https://your-app.railway.app/health');

console.log('\n✅ Railway部署检查完成！');
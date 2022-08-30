# 前端部署



## 环境变量

https://www.cnblogs.com/yaoqingzhuan/p/10889718.html



# 必要库安装

1. [nvm](https://github.com/nvm-sh/nvm)： 当前0.39.1版本，版本升级以下版本号需要更换;

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

或

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

安装完成添加环境变量

```bash
vim .bashrc
```

在最后一行添加 在`.bashrc` 

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

安装完成

```bash
nvm -v #0.39.1
nvm i node #下载最新版本的node
nvm ls #列出本地包
nvm ls-remote#列出远程包
```

2. yarn/pnpm

下载完node自带npm, 可以用其下载其他软件包

```bash
npm -g i yarn
npm -g i pnpm

which yarn # which可查看位置
```

3. nginx

- [LINUX安装nginx详细步骤](https://blog.csdn.net/t8116189520/article/details/81909574)







## 学习链接

[Linux 中各个文件夹的作用](https://www.cnblogs.com/Zhao--C/p/10721659.html)


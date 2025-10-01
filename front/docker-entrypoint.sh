#!/bin/sh
set -e

# node_modulesが存在しない場合はインストール
if [ ! -d "node_modules" ]; then
  echo "Installing npm packages..."
  npm install
fi

# 引数で渡されたコマンドを実行
exec "$@"

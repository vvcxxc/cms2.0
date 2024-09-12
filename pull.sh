#!/bin/bash

# 定义默认组件数组
default_widget_Array=(
    BarcodeManagement
    BOMManagement
    BusinessFieldSetting
    FlowManagement
    FormulaManagement
    Http
    Hyperlink
    MaterialManagement
    OrderManagement
    ProcessConfiguration
    ProcessManagement
    ProductionTracking
    ProductManagement
    QualityManagement
    SystemManagement
    TraceManagement
    ProductDelivery
    ConsoleManagement
)

# 从 .build 文件读取内容
buildFile="./.build"
build_widget_Array=()
if [ -f "$buildFile" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
        build_widget_Array+=("$line")
    done < "$buildFile"
fi
if [ -f "$buildFile.local" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
        build_widget_Array+=("$line")
    done < "$buildFile.local"
fi

# 检查并创建 src/widgets 目录
basePath="src/widgets"
if [ ! -d "$basePath" ]; then
    echo "目录 $basePath 不存在。正在创建..."
    mkdir -p "$basePath"
fi

# 定义一个函数来处理组件
process_widget() {
    local widgetName=$1
    local gitUrl=$2
    local widgetPath="$basePath/$widgetName"

    if [ -d "$widgetPath" ]; then
        # 如果文件夹存在，进入该文件夹并执行 git pull
        echo "目录 $widgetPath 已存在。正在拉取最新更改..."
        cd "$widgetPath" || exit

        # 检查是否设置了跟踪分支
        branch_name=$(git rev-parse --abbrev-ref HEAD)
        upstream_branch=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)

        if [ -z "$upstream_branch" ]; then
            echo "当前分支 $branch_name 没有设置上游分支。正在设置上游分支为 origin/$branch_name..."
            git branch --set-upstream-to=origin/$branch_name
        fi

        # 检查是否有未提交的更改
        stash_result=1
        if [ -n "$(git status --porcelain)" ]; then
            echo "检测到未提交的更改。正在暂存更改..."
            git stash push -m "在拉取 $widgetName 更改之前自动暂存"
            stash_result=$?
        fi

        # 尝试执行 git pull
        git pull --ff-only
        pull_result=$?

        # 如果有 stash，则尝试恢复
        if [ "$stash_result" -eq 0 ]; then
            echo "正在恢复暂存的更改..."
            git stash pop
        fi

        cd - || exit

        # 检查 pull 的结果
        if [ "$pull_result" -ne 0 ]; then
            echo "$widgetName 的 git pull 失败。请手动解决冲突。"
        fi
    else
        # 如果文件夹不存在，执行 git clone
        echo "目录 $widgetPath 不存在。正在克隆仓库..."
        git clone "$gitUrl" "$widgetPath"
    fi
}

# 处理默认组件数组
for widgetName in "${default_widget_Array[@]}"; do
    gitUrl="https://gitlab.syc-cms.com/lmes-plugin/web/$widgetName.git"
    process_widget "$widgetName" "$gitUrl"
done

# 处理 .build 文件中的组件数组
for widgetName in "${build_widget_Array[@]}"; do
    gitUrl="https://gitlab.syc-cms.com/lmes-plugin/web/business/$widgetName.git"
    process_widget "$widgetName" "$gitUrl"
done

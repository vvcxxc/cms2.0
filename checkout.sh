#!/bin/bash

# 默认组件数组
widget_Array=(
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

# 指定分支名作为参数传入
target_branch=$1

if [[ -z "$target_branch" ]]; then
    echo "请指定目标分支，例如: bash $0 feature/wg/test"
    exit 1
fi

# 读取 .build 文件内容
if [[ -f ./.build ]]; then
    while IFS= read -r line || [ -n "$line" ]; do
        widget_Array+=("$line")
    done < ./.build
fi

# 读取 .build 文件内容
if [[ -f ./.build.local ]]; then
    while IFS= read -r line || [ -n "$line" ]; do
        widget_Array+=("$line")
    done < ./.build.local
fi

# 去重
widget_Array=($(echo "${widget_Array[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '))

# 存储切换信息的数组
declare -a switch_info

# 循环遍历组件数组
for widgetName in "${widget_Array[@]}"; do
    # 检查组件目录是否存在
    if [[ -d "src/widgets/$widgetName" ]]; then
        # 进入组件目录
        cd "src/widgets/$widgetName" || { echo "无法进入目录 src/widgets/$widgetName"; continue; }
        
        # 获取当前分支名
        current_branch=$(git symbolic-ref --short HEAD)
        
        # 如果当前分支代码有变动，提交变更
        if [[ -n "$(git status --porcelain)" ]]; then
            git add .
            git commit -m 'merge'
        fi
        
        # 尝试切换到指定分支
        if git show-ref --verify --quiet refs/heads/"$target_branch"; then
            git checkout "$target_branch"
        else
            # 如果没有指定分支，创建一个
            git checkout -b "$target_branch"
        fi
        
        # 获取切换后的分支名
        new_branch=$(git symbolic-ref --short HEAD)
        
        # 推送指定分支到远程
        # git push --set-upstream origin "$target_branch"
        
        # 添加切换信息到数组
        switch_info+=("$widgetName: $current_branch -> $new_branch")
        
        # 返回到上一级目录
        cd - > /dev/null || exit
    else
        echo "目录 src/widgets/$widgetName 不存在"
    fi
done

# 统一输出切换信息
echo "切换信息："
for info in "${switch_info[@]}"; do
    echo "$info"
done

/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Log from './Log';

const TAG = 'Common-StyleManager';

// 定义一个名为 StyleManager 的类，并将其导出
export class StyleManager {

    // 在类中定义一个私有成员变量 mAbilityPageName，类型为字符串，初始值为空字符串
    mAbilityPageName: string = '';

    // 定义一个方法 setAbilityPageName，它接受一个字符串参数 name，用于设置 mAbilityPageName 的值。
    // 方法体中首先记录一条调试日志，然后更新 mAbilityPageName 的值。
    setAbilityPageName(name: string): void{
        Log.showDebug(TAG, `setAbilityPageName, name: ${name}`);
        this.mAbilityPageName = name;
    }

    // 定义一个方法 getStyle，它接受两个参数：
    // key：一个字符串，表示样式的键。
    // generateDefaultFunction：一个函数，用于生成默认样式。
    // 方法体中首先根据 mAbilityPageName 和 key 生成一个新的键 newKey。
    getStyle(key: string, generateDefaultFunction: Function) {
        let newKey = this.mAbilityPageName + '-' + key;
        if (!AppStorage.Has(newKey)) {
            let defaultStyle = generateDefaultFunction();
            AppStorage.SetOrCreate(newKey, defaultStyle);
            Log.showDebug(TAG, `Create storageKey of ${newKey}`);
        }
        return AppStorage.Get(newKey);
    }
}

let styleManager = new StyleManager();

export default styleManager as StyleManager;
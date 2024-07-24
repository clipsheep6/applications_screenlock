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

// 导入日志模块
import Log from '../Log';

const TAG = 'AbilityManager';

// 导出一个默认类 AbilityManager，这个类包含了管理 abilities 的静态方法
export default class AbilityManager {

  // 定义了不同的 abilities 名称，每个名称对应一个系统 UI 组件
  static ABILITY_NAME_ENTRY = 'SystemUi_Entry';
  static ABILITY_NAME_STATUS_BAR = 'SystemUi_StatusBar';
  static ABILITY_NAME_NAVIGATION_BAR = 'SystemUi_NavigationBar';
  static ABILITY_NAME_VOLUME_PANEL = 'SystemUi_VolumePanel';
  static ABILITY_NAME_NOTIFICATION_MANAGEMENT = 'SystemUi_NotificationManagement';
  static ABILITY_NAME_DROPDOWN_PANEL = 'SystemUi_DropdownPanel';
  static ABILITY_NAME_NOTIFICATION_PANEL = 'SystemUi_NotificationPanel';
  static ABILITY_NAME_CONTROL_PANEL = 'SystemUi_ControlPanel';
  static ABILITY_NAME_BANNER_NOTICE = 'SystemUi_BannerNotice';
  static ABILITY_NAME_SCREEN_LOCK = 'SystemUi_ScreenLock';

  // 设置 abilities 上下文的静态方法，接受一个 ability 名称和一个上下文对象
  // 将这个上下文存储在全局变量 globalThis 中
  static setContext(abilityName: string, context) {
    Log.showDebug(TAG, `setContext, abilityName: ${abilityName}`);
    globalThis[abilityName + '_Context'] = context;
  }

  // 获取 abilities 上下文的静态方法，如果没有提供 ability 名称，默认使用 ABILITY_NAME_ENTRY
  // getContext 方法用于获取存储在 globalThis 中的 abilities 上下文
  static getContext(abilityName?: string) {
    Log.showDebug(TAG, `getContext, abilityName: ${abilityName}`);
    if (!abilityName) {
      abilityName = AbilityManager.ABILITY_NAME_ENTRY;
    }
    return globalThis[abilityName + '_Context'];
  }

  // 设置 abilities 数据的静态方法，接受 ability名称、键和数据，将数据存储在全局变量 globalThis 中
  static setAbilityData(abilityName, key, data) {
    Log.showDebug(TAG, `setAbilityData, abilityName: ${abilityName} key: ${key} data: ${JSON.stringify(data)}`);
    globalThis[abilityName + '_data_' + key] = data;
  }

  // 获取 abilities 数据的静态方法，getAbilityData 方法用于从 globalThis 中获取存储的 abilities 数据
  static getAbilityData(abilityName, key) {
    Log.showDebug(TAG, `getAbilityData, abilityName: ${abilityName} key: ${key} `);
    return globalThis[abilityName + '_data_' + key];
  }

  // 启动 abilities 的静态方法，接受一个 want 对象，描述要启动的 ability，以及一个可选的回调函数
  // 使用 context.startAbility 启动 ability，并处理 Promise 的 .then 和 .catch
  static startAbility(want, callback?: Function) {
    Log.showDebug(TAG, `startAbility, want: ${JSON.stringify(want)}`);
    let context = AbilityManager.getContext();
    context.startAbility(want).then(() => {
      Log.showInfo(TAG, `startAbility, then`);
      if (callback) {
        callback(null);
      }
    }).catch((error) => {
      Log.showError(TAG, `startAbility, error: ${JSON.stringify(error)}`);
      callback(error);
    })
  }
}

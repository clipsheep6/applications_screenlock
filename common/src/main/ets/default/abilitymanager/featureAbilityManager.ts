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

import FeatureAbility from '@ohos.ability.featureAbility';
import Log from '../Log';

const TAG = 'FeatureAbilityManager';

// 定义了一个默认的导出类，包含与Ability相关的操作。
export default class FeatureAbilityManager {

  // 打开一个Ability，接收两个参数：tag是一个标识来源的标签，want是一个描述要打开的能力的对象。
  openAbility(tag, want) {
    Log.showInfo(TAG, `openAbility from: ${tag}`);
    // 使用FeatureAbility.startAbility(want)启动能力，并用Log记录相关信息。
    let result = FeatureAbility.startAbility(want)
      .then(data =>
    Log.showInfo(TAG, `tag: ${tag} promise then: ${JSON.stringify(data)}`))
      .catch(error =>
    Log.showError(TAG, `tag: ${tag} promise catch: ${JSON.stringify(error)}, openAbility result: ${result}`));
  }

  // 获取当前的Ability请求
  getAbilityWant(listener) {
    FeatureAbility.getWant((err, data) => {
      Log.showDebug(TAG, `getAbilityWant callBack err: ${JSON.stringify(err)} data: ${JSON.stringify(data)}`);
      // 如果成功获取，调用传入的listener回调函数，并传递获取到的数据
      if (err.code !== 0) {
        Log.showError(TAG, `failed to getAbilityWant because ${err.message}`);
        return;
      } else {
        if(listener != null && listener != undefined) {
          listener(data);
        }
      }
    });
  }

  // 结束当前的能力，并携带结果。
  finishAbilityWithResult(abilityResult) {
    FeatureAbility.finishWithResult(abilityResult, (err, data) => {
      // 如果结束失败，记录错误信息
      if (err.code !== 0) {
        Log.showError(TAG, `failed to finishWithResult because ${JSON.stringify(err)}`);
        return;
      }
      FeatureAbilityManager.finishAbility();
    });
  }

  // 静态方法，用于结束当前的能力
  static finishAbility() {
    FeatureAbility.terminateAbility((err, data) => {
      // 如果结束失败，记录错误信息
      if (err.code !== 0) {
        Log.showError(TAG, `failed to finishAbility because ${JSON.stringify(err)}`);
        return;
      }
      Log.showInfo(TAG, ` finishAbility callback: data:${data}`);
    });
  }
}
/**
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

// 从 OHOS（华为鸿蒙操作系统）的多媒体库中导入 audio 模块
import Log from './Log';
import audio from '@ohos.multimedia.audio';

const TAG = "SingleInstanceHelper";
const AUDIO_MANAGER_KEY = 'MultiMediaAudioManager';

// 定义一个默认导出的函数 createOrGet，它是一个泛型函数，接受两个参数：
// objectClass：一个构造函数，用于创建对象实例。
// storageKey：一个字符串，用作存储对象实例的键。
// 函数返回类型为 T，即 objectClass 创建的对象类型。
export default function createOrGet<T>(objectClass: { new(): T }, storageKey: string): T {
  // 检查 globalThis 对象中是否已经存在键为 storageKey 的属性。如果不存在，执行以下操作
  if (!globalThis[storageKey]) {
    // 创建 objectClass 的一个新实例，并将其存储在 globalThis 对象的 storageKey 属性中
    globalThis[storageKey] = new objectClass();
    Log.showDebug(TAG, `Create key of ${storageKey}`);
  }
  return globalThis[storageKey];
}

export function getAudioManager() {
  // 检查 globalThis 对象中是否已经存在键为 AUDIO_MANAGER_KEY 的属性。如果不存在，执行以下操作
  if (!globalThis[AUDIO_MANAGER_KEY]) {
    // 获取音频管理器实例，并将其存储在 globalThis 对象的 AUDIO_MANAGER_KEY 属性中
    globalThis[AUDIO_MANAGER_KEY] = audio.getAudioManager();
    Log.showInfo(TAG, `Create Audio Manager.`);
  }
  return globalThis[AUDIO_MANAGER_KEY];
}

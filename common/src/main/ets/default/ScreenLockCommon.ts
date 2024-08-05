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

// 定义了一个用于屏幕锁定功能的通用模块，包括日志记录、配置文件读取以及一个枚举类型定义屏幕锁定的不同状态。
import Log from './Log';
import AbilityManager from '../default/abilitymanager/abilityManager'

const TAG = 'ScreenLock-ScreenLockCommon';

// 导出一个枚举类型 ScreenLockStatus，定义了屏幕锁定状态的几种可能值：
// 锁定(Locking)、解锁(Unlock)、人脸识别中(RecognizingFace)、人脸未识别(FaceNotRecognized)。
export enum ScreenLockStatus {
  Locking = 1,
  Unlock = 2,
  RecognizingFace = 3,
  FaceNotRecognized = 4
}

// 导出一个函数 ReadConfigFile，用于读取配置文件。
// 它接收两个参数：fileName 是要读取的文件名，callBack 是一个回调函数，用于处理读取并解析完的JSON数据。
export function ReadConfigFile(fileName, callBack:(data)=>void) {
  Log.showInfo(TAG, `readConfigFile fileName:${fileName}`);
  let jsonCfg : string = "";
  let context = AbilityManager.getContext(AbilityManager.ABILITY_NAME_SCREEN_LOCK);
  Log.showInfo(TAG, `readConfigFile context:${context}`);
  let resManager = context.resourceManager;
  Log.showInfo(TAG, `readConfigFile resManager:${resManager}`);
  resManager.getRawFile(fileName).then((data)=>{
    let content : string = String.fromCharCode.apply(null, data);
    Log.showInfo(TAG, `readDefaultFile content length: ${content.length}`);
    jsonCfg = JSON.parse(content);
    callBack(jsonCfg);
  })
  .catch((error)=>{
    Log.showError(TAG, `readDefaultFile filed: ${JSON.stringify(error)}`);
  });
}
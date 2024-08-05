// @ts-nocheck
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

// 从 OHOS 系统事件模块导入 hiSysEvent，用于写入系统事件
import Log from "./Log";
import hiSysEvent from '@ohos.hiSysEvent'

// 定义一个常量 APP_DOMAIN，表示应用域。
// 定义一个常量 APP_LOG_NAME，表示日志名称
const TAG = 'SystemFaultLogger';
const APP_DOMAIN: string = "SYSTEMUI_APP";
const APP_LOG_NAME: string = "SCREENLOCK_FAULT";

// 定义一个接口 LogParam，表示日志参数的结构
interface LogParam {
  FAULT_ID: string,
  MSG: string
}

// 导出一个枚举 FaultID，表示不同的故障 ID
export enum FaultID {
  MEMORY = "MEMORY_MONITOR",
  SCREEN_LOCK_MANAGER = "CONNECT_SCREENLOCKMANAGERSERVICE_ABNORMAL",
  ACCOUNT_SYSTEM = "ACCOUNTSYSTEM_CALL_ABNORMAL"
}

// 导出一个函数 WriteFaultLog，用于写入故障日志
export function WriteFaultLog(logParam: LogParam) {
  // 创建一个 sysEventInfo 对象，包含系统事件的域、名称、事件类型和参数。
  const sysEventInfo = {
    domain: APP_DOMAIN,
    name: APP_LOG_NAME,
    eventType: hiSysEvent.EventType.FAULT,
    params: logParam
  }
  // 使用 hiSysEvent.write 方法写入系统事件，并提供回调函数来处理写入结果。
  hiSysEvent.write(sysEventInfo, (err, val) => {
    Log.showInfo(TAG, "fault log params is : " + JSON.stringify(sysEventInfo))
    Log.showInfo(TAG, `write fault log result: ${val}`)
  })
}

// 导出一个函数 SysFaultLogger，它是一个装饰器工厂，用于创建方法装饰器。
export function SysFaultLogger(logParam: LogParam) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunc = descriptor.value;
    descriptor.value = function(...args) {
      try {
        originalFunc.apply(this, args);
      }  catch (err: any) {
        Log.showInfo(TAG, "catch error in execute: " + propertyKey);
        WriteFaultLog(logParam);
      }
    };
  };
}
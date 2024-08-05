/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

// 导入 byTrace 模块用于跟踪操作，以及 Log 模块用于日志记录。
import byTrace from "@ohos.bytrace";
import Log from "./Log";

// 定义一个默认导出的 Trace 类。
export default class Trace {

  // CORE_METHOD_*：定义了一些核心方法的追踪名称，这些名称将用于追踪特定的操作。
  static readonly CORE_METHOD_UNLOCK_SCREEN = "unlockScreen"
  static readonly CORE_METHOD_CALL_ACCOUNT_SYSTEM = "callAccountSubsystem";
  static readonly CORE_METHOD_PASS_ACCOUNT_SYSTEM_RESULT = "passingAccountSubsystemResult";
  static readonly CORE_METHOD_HIDE_PSD_PAGE = "hidePsdPage";
  static readonly CORE_METHOD_SHOW_LOCK_SCREEN = "showLockScreen";
  static readonly CORE_METHOD_SLEEP_TO_LOCK_SCREEN = "sleepToLockScreen"

  // TRACE_TAG：用于日志记录的标签。
  // RECORD_TRACE：一个布尔值，用于控制是否进行追踪记录。
  // TRACE_LIMIT：定义了追踪记录的长度限制。
  // TRACE_BASE_INDEX：追踪任务ID的起始索引。
  private static readonly TRACE_TAG = 'ScreenLock:Trace';
  private static readonly RECORD_TRACE = true;
  private static readonly TRACE_LIMIT = 2000;
  private static readonly TRACE_BASE_INDEX = 10020;

  // 一个私有静态方法，用于初始化追踪参数。
  // 它检查全局变量 globalThis.taskIdMap 和 globalThis.traceIndex 是否已定义，如果没有，它们会被初始化。
  private static init() {
    Log.showInfo(this.TRACE_TAG, 'init trace parameters');
    globalThis.taskIdMap = new Map<string, number>();
    globalThis.traceIndex = Trace.TRACE_BASE_INDEX;
  }

  // 一个静态方法，用于开始追踪一个方法的执行。它首先检查是否应该记录追踪（通过 RECORD_TRACE）。
  // 然后它获取或创建一个任务ID，并使用 byTrace.startTrace 方法开始追踪。
  static start(methodName: string) {
    if (!Trace.RECORD_TRACE) return;
    if (typeof globalThis.taskIdMap === 'undefined' || typeof globalThis.traceIndex === 'undefined') {
      Trace.init();
    }
    let taskId = globalThis.taskIdMap.get(methodName);
    if (taskId == undefined) {
      taskId = globalThis.traceIndex;
      globalThis.traceIndex++;
      globalThis.taskIdMap.set(methodName, taskId);
    }
    Log.showInfo(this.TRACE_TAG, `start trace ${taskId} for ${methodName}`);
    byTrace.startTrace(this.TRACE_TAG + methodName, taskId, Trace.TRACE_LIMIT);
  }

  // 一个静态方法，用于结束一个方法的追踪。
  // 它同样检查 RECORD_TRACE，获取任务ID，并使用 byTrace.finishTrace 方法结束追踪。
  static end(methodName: string) {
    if (!Trace.RECORD_TRACE) return;
    if (typeof globalThis.taskIdMap === 'undefined') {
      return;
    }
    const taskId = globalThis.taskIdMap.get(methodName);
    if (taskId == undefined) {
      Log.showError(this.TRACE_TAG, `fail to end trace name ${methodName}`);
      return;
    }
    Log.showInfo(this.TRACE_TAG, `end trace ${taskId} for ${methodName}`);
    byTrace.finishTrace(this.TRACE_TAG + methodName, taskId);
  }
}
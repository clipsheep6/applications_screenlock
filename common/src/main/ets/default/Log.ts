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

// 这行代码从 @ohos.hilog 包中导入了 hiLog 对象，这可能是一个用于日志记录的模块，特定于HarmonyOS开发环境。
import hiLog from '@ohos.hilog';

// 定义了一些常量，如 DOMAIN, TAG, SYMBOL, 和一个正则表达式数组 FILTER_KEYS，这些常量可能用于日志记录或数据过滤。
const DOMAIN: number = 0x002A;
const TAG = "ScreenLock_Default";
const SYMBOL = " --> ";
const FILTER_KEYS = [
    new RegExp('hide', "gi")
]

// 这是一个装饰器函数，用于拦截类的方法调用，并对其进行处理。
// 它接收三个参数：target 是类原型，propKey 是方法名，descriptor 是方法的属性描述符。
export function filterKey(target: any, propKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: string[]) {
        let filterResult = args.map((str) => {
            let tempStr = str
            FILTER_KEYS.forEach((filterKey) => tempStr = tempStr.replace(filterKey, "**"))
            return tempStr
        });
        const result = original.call(this, ...filterResult);
        return result;
    };
}

/**
 * Basic log class
 */

// 定义了一个默认导出的日志类 Log，包含多个静态方法用于不同级别的日志输出。
// 每个静态方法（如 showDebug, showInfo, showWarn, showError, showFatal）都接收三个参数：tag, format, 和剩余参数 args。这些方法用于输出不同级别的日志。
// 在输出日志之前，会调用 Log.isLogGable 方法检查是否应该输出日志，这取决于 DOMAIN, TAG 和日志级别。
export default class Log {
    /**
     * Outputs debug-level logs.
     *
     * @param tag Identifies the log tag.
     * @param format Indicates the log format string.
     * @param args Indicates the log parameters.
     * @since 7
     */
    static showDebug(tag: string, format: string, ...args: any[]) {
        if (Log.isLogGable(hiLog.LogLevel.DEBUG)) {
            hiLog.debug(DOMAIN, TAG, tag + SYMBOL + format, args);
        }
    }

    /**
     * Outputs info-level logs.
     *
     * @param tag Identifies the log tag.
     * @param format Indicates the log format string.
     * @param args Indicates the log parameters.
     * @since 7
     */
    static showInfo(tag: string, format: string, ...args: any[]) {
        if (Log.isLogGable(hiLog.LogLevel.INFO)) {
            hiLog.info(DOMAIN, TAG, tag + SYMBOL + format, args);
        }
    }

    /**
     * Outputs warning-level logs.
     *
     * @param tag Identifies the log tag.
     * @param format Indicates the log format string.
     * @param args Indicates the log parameters.
     * @since 7
     */
    static showWarn(tag: string, format: string, ...args: any[]) {
        if (Log.isLogGable(hiLog.LogLevel.WARN)) {
            hiLog.warn(DOMAIN, TAG, tag + SYMBOL + format, args);
        }
    }

    /**
     * Outputs error-level logs.
     *
     * @param tag Identifies the log tag.
     * @param format Indicates the log format string.
     * @param args Indicates the log parameters.
     * @since 7
     */
    static showError(tag: string, format: string, ...args: any[]) {
        if (Log.isLogGable(hiLog.LogLevel.ERROR)) {
            hiLog.error(DOMAIN, TAG, tag + SYMBOL + format, args);
        }
    }

    /**
     * Outputs fatal-level logs.
     *
     * @param tag Identifies the log tag.
     * @param format Indicates the log format string.
     * @param args Indicates the log parameters.
     * @since 7
     */
    static showFatal(tag: string, format: string, ...args: any[]) {
        if (Log.isLogGable(hiLog.LogLevel.FATAL)) {
            hiLog.fatal(DOMAIN, TAG, tag + SYMBOL + format, args);
        }
    }

    /**
     * Checks whether logs of the specified tag, and level can be printed.
     *
     * @param tag Identifies the log tag.
     * @param level log level
     * @since 7
     */
    private static isLogGable(level: hiLog.LogLevel): boolean {
        return hiLog.isLoggable(DOMAIN, TAG, level);
    }
}

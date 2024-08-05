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

// BundleMgr是用于管理应用包（Bundle）的API集合，它提供了一系列的功能来操作和管理应用包，例如安装、卸载、查询应用包信息等
import BundleMgr from "@ohos.bundle";
import Context from "application/ServiceExtensionContext";
import Log from "../Log";
// 导入用户切换与管理的类
import SwitchUserManager from "../SwitchUserManager";

const TAG = "BRManager";

// 定义一个默认导出的类 BundleManager，这个类提供了一些静态方法来管理应用包
export default class BundleManager {

    // 一个静态的异步方法，用于获取资源管理器
    // 接收三个参数：tag 是一个标识来源的字符串，context 是上下文对象，bundleName 是要获取资源管理器的应用包名称
    // 方法内部首先记录了一条信息日志，然后使用 context 创建了一个新的包上下文，并返回了这个包的资源管理器
    static async getResourceManager(tag: string, context: Context, bundleName: string) {
        Log.showInfo(TAG, `getResourceManager from: ${tag}`);
        let bundleContext = await context.createBundleContext(bundleName)
        return await bundleContext.resourceManager;
    }

    // 一个静态的异步方法，用于获取包信息，接收四个参数：tag 是标识来源的字符串，bundleName 是包名称，
    // getInfo 是一个任意类型的参数，可能是用于指定获取哪些信息，requestId 是一个可选参数，用于指定请求的用户ID。
    static async getBundleInfo(tag: string, bundleName: string, getInfo: any, requestId?: number) {
        // 创建一个 userInfo 对象，其中包含 userId。如果 requestId 未提供，则使用 SwitchUserManager 获取当前用户的ID。
        let userInfo = {
            userId: requestId ?? (await SwitchUserManager.getInstance().getCurrentUserInfo()).userId,
        };
        Log.showDebug(TAG, `getBundleInfo from: ${tag}, userId: ${userInfo.userId}`);
        return await BundleMgr.getBundleInfo(bundleName, getInfo, userInfo);
    }

}
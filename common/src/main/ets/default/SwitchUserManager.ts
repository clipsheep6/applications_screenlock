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

// 从 OHOS 系统账号管理模块导入 AccountManager 类
// 从当前目录下的 SingleInstanceHelper 文件导入 getSingleInstance 函数，可能用于获取单例对象
import AccountManager from "@ohos.account.osAccount";
import Log from "./Log";
import getSingleInstance from "./SingleInstanceHelper";

// 定义一个常量 SUBSCRIBE_KEY，用作订阅账号变更事件的键。
// 定义一个常量 USER_CHANGE_EVENT，表示用户变更事件的名称。
// 定义一个常量 DELAY_TIME，表示延迟时间，单位为毫秒。
// 导出一个常量 INVALID_USER_ID，表示无效的用户 ID。
const TAG = "SwitchUserManagerSc";
const SUBSCRIBE_KEY = "SystemUiAccount";
const USER_CHANGE_EVENT = "activate";
const DELAY_TIME = 50 * 1000;
export const INVALID_USER_ID = -1;

// 定义一个类型别名 AccountInfo，表示账号信息的结构。
type AccountInfo = {
  localId: number;
  localName: string;
  photo: string;
};

// 导出一个类型别名 UserChangeListener，表示用户变更监听器的接口。
export type UserChangeListener = {
  userChange: (data: UserInfo) => void;
};

// 导出一个类 UserInfo，表示用户信息。
export class UserInfo {
  userId: number = INVALID_USER_ID;
  userName: string = "";
  userIcon: string | Resource = "";
  [key: string]: any;
}

// 定义一个异步函数 getCurrentAccountInfo，用于获取当前激活的账号信息。
async function getCurrentAccountInfo(): Promise<AccountInfo> {
  let accountInfos = await AccountManager.getAccountManager().queryAllCreatedOsAccounts();
  Log.showInfo(TAG, `accountInfos size:${accountInfos.length}`);
  for (let accountInfo of accountInfos) {
    Log.showDebug(TAG, `accountInfo: ${accountInfo.localId}, isActive: ${accountInfo.isActived}`);
    if (accountInfo.isActived) {
      return accountInfo;
    }
  }
  return Promise.reject("Can't get active userInfo.");
}

// 定义一个函数 parseAccountInfo，用于将 AccountInfo 转换为 UserInfo。
function parseAccountInfo(accountInfo: AccountInfo): UserInfo {
  return {
    userId: accountInfo.localId,
    userName: accountInfo.localName,
    userIcon: accountInfo.photo,
  };
}

// 定义一个默认导出的类 SwitchUserManager。
export default class SwitchUserManager {
  mUserInfo: UserInfo = new UserInfo();
  mListeners = new Set<UserChangeListener>();
  mHasWait: boolean = false;

  static getInstance(): SwitchUserManager {
    return getSingleInstance(SwitchUserManager, TAG);
  }

  constructor() {
    Log.showDebug(TAG, `SwitchUserManager constructor`);
    AccountManager.getAccountManager().on(USER_CHANGE_EVENT, SUBSCRIBE_KEY, this.handleUserChange.bind(this));
  }

  public async getCurrentUserInfo(): Promise<UserInfo> {
    if (this.mUserInfo.userId == INVALID_USER_ID) {
      !this.mHasWait && (await new Promise((resolve) => setTimeout(resolve, DELAY_TIME)));
      this.mHasWait = true;
      this.mUserInfo = parseAccountInfo(await getCurrentAccountInfo());
    }
    Log.showInfo(TAG, `getCurrentUserInfo userId: ${this.mUserInfo.userId}`);
    return this.mUserInfo;
  }

  public registerListener(listener: UserChangeListener) {
    this.mListeners.add(listener);
  }

  public unregisterListener(listener: UserChangeListener) {
    this.mListeners.delete(listener);
  }

  handleUserChange(accountId: number): void {
    AccountManager.getAccountManager()
      .queryOsAccountById(accountId)
      .then((accountInfo) => {
        Log.showInfo(TAG, `userChange, accountInfo: ${JSON.stringify(accountInfo)}`);
        this.mUserInfo = parseAccountInfo(accountInfo);
        this.notifyUserChange();
      })
      .catch((err) => Log.showError(TAG, `Can't query account by ${accountId}, err: ${err}`));
  }

  notifyUserChange() {
    this.mListeners.forEach((listener) => listener.userChange(this.mUserInfo));
  }
}
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

// 导入窗口（Window）、日志（Log）、事件管理器（EventManager）、事件工具（EventUtil）和一些常量（Constants）模块。
import Window from "@ohos.window";
import Log from "./Log";
import EventManager from "./event/EventManager";
import { obtainLocalEvent } from "./event/EventUtil";
import { Rect } from "./Constants";
import createOrGet from "./SingleInstanceHelper";

// 定义了WindowInfo类型，用于存储窗口的可见性和尺寸信息。
export type WindowInfo = {
  visibility: boolean;
  rect: Rect;
};

// 定义了WindowType枚举，列出了不同类型的系统窗口。
export enum WindowType {
  STATUS_BAR = "SystemUi_StatusBar",
  NAVIGATION_BAR = "SystemUi_NavigationBar",
  DROPDOWN_PANEL = "SystemUi_DropdownPanel",
  NOTIFICATION_PANEL = "SystemUi_NotificationPanel",
  CONTROL_PANEL = "SystemUi_ControlPanel",
  VOLUME_PANEL = "SystemUi_VolumePanel",
  BANNER_NOTICE = 'SystemUi_BannerNotice'
}

// 定义了两个事件常量WINDOW_SHOW_HIDE_EVENT和WINDOW_RESIZE_EVENT，用于窗口显示/隐藏和调整大小事件。
export const WINDOW_SHOW_HIDE_EVENT = "WindowShowHideEvent";
export const WINDOW_RESIZE_EVENT = "WindowResizeEvent";

// WindowHandle用于表示窗口句柄
type WindowHandle = typeof Window.Window;
const TAG = "WindowManagerSc";

// 一个映射对象，将WindowType映射到系统窗口类型ID。
const SYSTEM_WINDOW_TYPE_MAP: { [key in WindowType]: number } = {
  SystemUi_StatusBar: 2108,
  SystemUi_NavigationBar: 2112,
  SystemUi_DropdownPanel: 2109,
  SystemUi_NotificationPanel: 2111,
  SystemUi_ControlPanel: 2111,
  SystemUi_VolumePanel: 2111,
  SystemUi_BannerNotice: 2111,
};

// 定义了窗口信息的默认值。
const DEFAULT_WINDOW_INFO: WindowInfo = {
  visibility: false,
  rect: { left: 0, top: 0, width: 0, height: 0 },
};

// 定义了一个窗口管理类
class WindowManager {
  mWindowInfos: Map<WindowType, WindowInfo> = new Map();

  // 创建一个窗口，并加载指定的内容。
  async createWindow(context: any, name: WindowType, rect: Rect, loadContent: string): Promise<WindowHandle> {
    Log.showInfo(TAG, `createWindow name: ${name}, rect: ${JSON.stringify(rect)}, url: ${loadContent}`);
    let winHandle = null;
    try{
      winHandle = await Window.create(context, name, SYSTEM_WINDOW_TYPE_MAP[name]);
      await winHandle.moveTo(rect.left, rect.top);
      await winHandle.resetSize(rect.width, rect.height);
      await winHandle.loadContent(loadContent);
      this.mWindowInfos.set(name, { visibility: false, rect });
      Log.showInfo(TAG, `create window[${name}] success.`);
    } catch (err) {
      Log.showError(TAG, `create window[${name}] failed. error:${JSON.stringify(err)}`);
    }
    return winHandle;
  }

  // 调整指定窗口的大小
  async resetSizeWindow(name: WindowType, rect: Rect): Promise<void> {
    Log.showInfo(TAG, `resetSizeWindow name: ${name}, rect: ${JSON.stringify(rect)}`);
    let window = null;
    try {
      window = await Window.find(name);
      await window.moveTo(rect.left, rect.top);
      await window.resetSize(rect.width, rect.height);
    } catch(err) {
      Log.showError(TAG, `resetSizeWindow failed. error:${JSON.stringify(err)}`);
    }
    this.mWindowInfos.set(name, { ...(this.mWindowInfos.get(name) ?? DEFAULT_WINDOW_INFO), rect });
    EventManager.publish(
      obtainLocalEvent(WINDOW_RESIZE_EVENT, {
        windowName: name,
        rect,
      })
    );
    Log.showInfo(TAG, `resize window[${name}] success.`);
  }

  // 显示指定的窗口
  async showWindow(name: WindowType): Promise<void> {
    Log.showInfo(TAG, `showWindow name: ${name}`);
    let window = null;
    try {
      window = await Window.find(name);
      await window.show();
    } catch (err) {
      Log.showError(TAG, `showWindow failed. error:${JSON.stringify(err)}`);
    }
    this.mWindowInfos.set(name, { ...(this.mWindowInfos.get(name) ?? DEFAULT_WINDOW_INFO), visibility: true });
    EventManager.publish(
      obtainLocalEvent(WINDOW_SHOW_HIDE_EVENT, {
        windowName: name,
        isShow: true,
      })
    );
    Log.showInfo(TAG, `show window[${name}] success.`);
  }

  // 隐藏指定的窗口
  async hideWindow(name: WindowType): Promise<void> {
    Log.showInfo(TAG, `hideWindow name: ${name}`);
    let window = null;
    try {
      window = await Window.find(name);
      await window.hide();
    } catch (err) {
      Log.showError(TAG, `hideWindow failed. error:${JSON.stringify(err)}`);
    }
    this.mWindowInfos.set(name, { ...(this.mWindowInfos.get(name) ?? DEFAULT_WINDOW_INFO), visibility: false });
    EventManager.publish(
      obtainLocalEvent(WINDOW_SHOW_HIDE_EVENT, {
        windowName: name,
        isShow: false,
      })
    );
    Log.showInfo(TAG, `hide window[${name}] success.`);
  }

  // 获取指定窗口的信息
  getWindowInfo(name: WindowType): WindowInfo | undefined {
    return this.mWindowInfos.get(name);
  }

  // 设置窗口信息，这个方法被注释为需要移除
  setWindowInfo(configInfo) {
    Log.showDebug(TAG, `setWindowInfo, configInfo ${JSON.stringify(configInfo)}`);
    let maxWidth = AppStorage.SetAndLink("maxWidth", configInfo.maxWidth);
    let maxHeight = AppStorage.SetAndLink("maxHeight", configInfo.maxHeight);
    let minHeight = AppStorage.SetAndLink("minHeight", configInfo.minHeight);
    maxWidth.set(configInfo.maxWidth);
    maxHeight.set(configInfo.maxHeight);
    minHeight.set(configInfo.minHeight);
  }
}

let sWindowManager = createOrGet(WindowManager, TAG);
export default sWindowManager as WindowManager;

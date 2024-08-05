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

//import { NotificationSubscriber } from './notification/notificationSubscriber';
import Notification from '@ohos.notification';
import Log from '../Log';

const TAG = 'NotificationManager';

// 定义了一个默认导出的类，包含与通知相关的操作。
export default class NotificationManager {

  //  定义了三种通知内容类型，分别对应基本文本、长文本和多行文本。
  static TYPE_BASIC: number = Notification.ContentType.NOTIFICATION_CONTENT_BASIC_TEXT;
  static TYPE_LONG: number = Notification.ContentType.NOTIFICATION_CONTENT_LONG_TEXT;
  static TYPE_MULTI: number = Notification.ContentType.NOTIFICATION_CONTENT_MULTILINE;

  // 订阅通知。接收三个参数：tag是一个标识来源的标签，subscriber是订阅者对象，asyncCallback是异步回调函数
  static subscribeNotification(tag, subscriber, asyncCallback) {
    Log.showInfo(TAG, `subscribeNotification from: ${tag}`));
    Notification.subscribe(subscriber, asyncCallback);
  }

  // 取消订阅通知。接收两个参数：tag和subscriber
  static unsubscribeNotification(tag, subscriber) {
    Log.showInfo(TAG, `subscribeNotification from: ${tag}`));
    Notification.unsubscribe(subscriber);
  }

  // 移除所有通知。接收两个参数：tag和callback
  static removeAll(tag, callback) {
    Log.showInfo(TAG, `removeAll from: ${tag}`));
    Notification.removeAll(callback);
  }

  // 移除指定的通知。接收三个参数：tag, hashCode（通知的唯一标识符）和callback
  static remove(tag, hashCode, callback) {
    Log.showInfo(TAG, `remove from: ${tag}`));
    Notification.remove(hashCode, callback)
  }

  // 获取所有活跃的通知。接收两个参数：tag和callback
  static getAllActiveNotifications(tag, callback) {
    Log.showInfo(TAG, `getAllActiveNotifications from: ${tag}`));
    Notification.getAllActiveNotifications(callback);
  }

}
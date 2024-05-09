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

import Log from '../../../../../../../../common/src/main/ets/default/Log'
import {ScreenLockStatus} from '../../../../../../../../common/src/main/ets/default/ScreenLockCommon'
import screenLockService from '../model/screenLockService'
import commonEventManager from '@ohos.commonEventManager';
import Base from '@ohos.base';

const TAG = 'ScreenLock-LockIconViewModel'

export default class LockIconViewModel {
    cutMessage: any= {}
    iconPath: any= {}
    isLoad: boolean = false;

    ViewModelInit(): void{
        Log.showDebug(TAG, `ViewModelInit`);
        this.iconPath = $r('app.media.ic_public_lock_filled');
        this.cutMessage = $r('app.string.lock_prompt')
    }

    private launcherLoad():void {
        Log.showError(TAG, `launcherLoad 开始执行`)
        // 用于保存创建成功的订阅者对象，后续使用其完成订阅及退订的动作
        let subscriber: commonEventManager.CommonEventSubscriber | null = null;
        // 订阅者信息，其中的event字段需要替换为实际的事件名称。
        let subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
            events: ['launcher_completed_event'], // 订阅桌面加载完成事件
        };

        // 创建订阅者回调
        commonEventManager.createSubscriber(subscribeInfo, (err: Base.BusinessError, data: commonEventManager.CommonEventSubscriber) => {
            if (err) {
                Log.showError(TAG, `Failed to create subscriber. Code is ${err.code}, message is ${err.message}`);
                return;
            }
            subscriber = data;
            Log.showError(TAG, `创建订阅者回调内 ${JSON.stringify(subscriber)}`)
            // 订阅公共事件回调
            if (!subscriber){
                Log.showError(TAG, `创建失败 create subscriber fail`);
                return
            }
            Log.showError(TAG, `创建成功 订阅公共事件回调`)
            try {
                commonEventManager.subscribe(subscriber, (err: Base.BusinessError, data: commonEventManager.CommonEventData) => {
                    Log.showError(TAG, `订阅公共事件回调 data: code:${data?.code}  data${data?.data}`);
                    if (err) {
                        Log.showError(TAG, `Failed to subscribe common event. Code is ${err.code}, message is ${err.message}`);
                        return;
                    }
                    Log.showError(TAG, `开始去更改`);
                    this.isLoad = true;
                    AppStorage.setOrCreate('launcherIsLoad', true)
                })
            } catch (err) {
                Log.showError(TAG, `给爷打印这个err: ${err}`)
            }

        })
    }

    onStatusChange(lockStatus: ScreenLockStatus): void {
        Log.showInfo(TAG, `onStatusChange lockStatus:${lockStatus}`);
        switch (lockStatus) {
            case ScreenLockStatus.Locking:
                this.iconPath = $r('app.media.ic_public_lock_filled');
                this.cutMessage = $r('app.string.lock_prompt')
                break;
            case ScreenLockStatus.Unlock:
            // this.iconPath = $r('app.media.ic_public_unlock_filled');
            // this.cutMessage = $r('app.string.unlock_prompt')
                if (!this.isLoad){
                    AppStorage.SetOrCreate('lockStatus', ScreenLockStatus.Locking);
                    Log.showError(TAG, `桌面没有准备好呢 继续锁定状态`)
                }else {
                    this.iconPath = $r('app.media.ic_public_unlock_filled');
                    this.cutMessage = $r('app.string.unlock_prompt')
                }
                break;
            case ScreenLockStatus.RecognizingFace:
                this.iconPath = $r('app.media.ic_public_unlock_filled');
                this.cutMessage = $r('app.string.recognizing_face')
                break;
            case ScreenLockStatus.FaceNotRecognized:
                this.iconPath = $r('app.media.ic_public_unlock_filled');
                this.cutMessage = $r('app.string.face_not_recognized')
                break;
            default:
                this.iconPath = $r('app.media.ic_public_lock_filled');
                this.cutMessage = $r('app.string.lock_prompt')
                break;
        }
    }

    onRecognizeFace(lockStatus: ScreenLockStatus) {
        Log.showInfo(TAG, `onRecognizeFace lockStatus: ${lockStatus}`);
        if (lockStatus == ScreenLockStatus.FaceNotRecognized) {
            screenLockService.authUserByFace()
        }
    }
}
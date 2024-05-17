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

const TAG = 'ScreenLock-LockIconViewModel'

export default class LockIconViewModel {
    cutMessage: any= {}
    iconPath: any= {}
    isLoad: boolean|undefined = false;

    ViewModelInit(): void{
        Log.showDebug(TAG, `ViewModelInit`);
        this.iconPath = $r('app.media.ic_public_lock_filled');
        this.cutMessage = $r('app.string.lock_prompt');
    }

    onStatusChange(lockStatus: ScreenLockStatus): void {
        Log.showError(TAG, `onStatusChange lockStatus:${lockStatus}`);
        switch (lockStatus) {
            case ScreenLockStatus.Locking:
                this.iconPath = $r('app.media.ic_public_lock_filled');
                this.cutMessage = $r('app.string.lock_prompt')
                break;
            case ScreenLockStatus.Unlock:
            // this.iconPath = $r('app.media.ic_public_unlock_filled');
            // this.cutMessage = $r('app.string.unlock_prompt')git
                this.isLoad = AppStorage.get('launcherIsLoad')
                if (this.isLoad == undefined ){
                    AppStorage.SetOrCreate('lockStatus', ScreenLockStatus.Locking);
                    setTimeout(()=>{
                        AppStorage.SetOrCreate('lockStatus', ScreenLockStatus.LauncherLoadUnlock);
                        AppStorage.SetOrCreate('launcherIsLoad', true)
                    }, 6000)
                    return
                }
                Log.showError(TAG, `这个应该被改的isLoad是外：${this.isLoad}`)
                if (!this.isLoad){
                    Log.showError(TAG, `这个应该被改的isLoad是内：${this.isLoad}`)
                    AppStorage.SetOrCreate('lockStatus', ScreenLockStatus.Locking);
                    Log.showError(TAG, `桌面没有准备好呢 继续锁定状态`)
                }else {
                    this.iconPath = $r('app.media.ic_public_unlock_filled');
                    this.cutMessage = $r('app.string.unlock_prompt')
                }
                break;
            case ScreenLockStatus.LauncherLoadUnlock:
                this.iconPath = $r('app.media.ic_public_unlock_filled');
                this.cutMessage = $r('app.string.unlock_prompt')
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
        Log.showError(TAG, `onRecognizeFace lockStatus: ${lockStatus}`);
        if (lockStatus == ScreenLockStatus.FaceNotRecognized) {
            screenLockService.authUserByFace()
        }
    }
}
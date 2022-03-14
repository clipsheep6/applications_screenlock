/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

import Log from '../../../../../../../common/src/main/ets/default/Log.ets';
import {ReadConfigFile} from '../../../../../../../common/src/main/ets/default/ScreenLockCommon.ets'
import ScreenLockService from '../../../../../../../features/screenlock/src/main/ets/com/ohos/model/screenLockService.ets'
import Constants from '../common/constants.ets'
import WindowManager from '../../../../../../../common/src/main/ets/default/WindowManager.ets'

const TAG = 'ScreenLock-SlideScreenLockViewModel'
//Height of notification area.
const NOTIFICATION_MAXHEIGHT = 500
const SLIDING_LENGTH = 200

export default class SlideScreenLockViewModel {
  startX: number = 0
  startY: number = 0
  moveX: number = 0
  moveY: number = 0
  slidingLength: number = 0
  elementAlpha: number = 1
  elementScale: number = 1
  backgroundBlur: number = 1
  backgroundScale: number = 1 / 0.91

  ViewModelInit(): void{
    Log.showInfo(TAG, 'ViewModelInit');
    let mWindowManager = new WindowManager();
    mWindowManager.initWindowManager();
    this.slidingLength = SLIDING_LENGTH
    AppStorage.SetOrCreate('maxHeight', NOTIFICATION_MAXHEIGHT);
  }

  unlockScreen(): void{
    ScreenLockService.unlockScreen()
  }

  touchEvent(event: TouchEvent) {
    Log.showInfo(TAG, `Touch Event ${event.type} at Point ${event.touches[0].x}, ${event.touches[0].y}`)
    if (event.type == Constants.TOUCHTYPE_DOWN) {
      this.startX = event.touches[0].screenX
      this.startY = event.touches[0].screenY
    } else if (event.type == Constants.TOUCHTYPE_MOVE) {
      this.moveX = event.touches[0].screenX - this.startX
      this.moveY = event.touches[0].screenY - this.startY
    } else if (event.type == Constants.TOUCHTYPE_UP) {
      Log.showInfo(TAG, `Touch Event slidingLength：${this.slidingLength}`)
      if (Math.abs(this.moveY) > this.slidingLength) {
        this.unlockScreen()
      }
      this.moveX = 0
      this.moveY = 0
    }
    this.update(this.moveY)
  }

  private update(moveLength: number) {
    let length = Math.min(Math.abs(moveLength), this.slidingLength)
    this.elementAlpha = 1 - 1 * length / this.slidingLength
    this.elementScale = 1 - 0.15 * length / this.slidingLength
    this.backgroundBlur = 80 * length / this.slidingLength
    this.backgroundScale = 1 / 0.91 * (1 - 0.09 * length / this.slidingLength)
  }
}
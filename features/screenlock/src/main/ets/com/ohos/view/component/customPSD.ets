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

import Log from '../../../../../../../../../common/src/main/ets/default/Log'
import Constants from '../../common/constants'
import NumkeyBoard from './numkeyBoard'
import ViewModel from '../../vm/customPSDViewModel'
import deviceInfo from '@ohos.deviceInfo';

const TAG = 'ScreenLock-CustomPSD'

@Component
export default struct CustomPSD {
  @State mViewModel: ViewModel = new ViewModel()
  @StorageLink('passwordArr') passwordArr: any[]  = this.mViewModel.passwordArr

  aboutToAppear() {
    Log.showInfo(TAG, `aboutToAppear`)
    this.mViewModel.checkFreezingTime(() => {
      Log.showInfo(TAG, `onClick callback is called`)
    });
  }

  aboutToDisappear() {
    Log.showInfo(TAG, `aboutToDisappear`)
    this.mViewModel.clearPassword()
  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.End }) {
      Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.End }) {
        Text(this.mViewModel.prompt)
          .fontSize(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_prompt_fontsize') : 16)
          .fontWeight(deviceInfo.deviceType === 'tablet' ? FontWeight.Bold : 'Medium')
          .fontColor(Color.White)
          .margin({ bottom: deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_prompt_margin_bottom') : 24 })
          .textAlign(TextAlign.Center)
          .textOverflow({ overflow: TextOverflow.None })
          .width($r('app.float.custompsd_prompt_width'))
          .height(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_prompt_height') : 22)

        Stack({ alignContent: Alignment.Center }) {
          Text()
            .width(deviceInfo.deviceType === 'tablet' ? Constants.FULL_CONTAINER_WIDTH : 288)
            .height(deviceInfo.deviceType === 'tablet' ? Constants.FULL_CONTAINER_HEIGHT : 36)
            .backgroundColor(Color.Gray)
            .borderRadius(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_input_radius') : 18)
            .opacity(deviceInfo.deviceType === 'tablet' ? 1 : 0.2)

          List({ space: Constants.DIGITALPSD_IC_DIAMETER }) {
            ForEach(this.passwordArr, (item) => {
              ListItem() {
                Image($r("app.media.ic_solid_dot"))
                  .width(deviceInfo.deviceType === 'tablet' ? Constants.DIGITALPSD_IC_DIAMETER : 9)
                  .height(deviceInfo.deviceType === 'tablet' ? Constants.DIGITALPSD_IC_DIAMETER : 9)
              }
            })
          }
          .listDirection(Axis.Horizontal)
          .height(deviceInfo.deviceType === 'tablet' ? Constants.DIGITALPSD_IC_DIAMETER : 9)
        }
        .width(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_input_width') : 288)
        .height(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_input_height') : 36)

        Button(deviceInfo.deviceType === 'tablet' ? $r('app.string.done') : '确认', {
          type: ButtonType.Capsule,
          stateEffect: true
        })
          .width(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_input_width') : 288)
          .height(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_input_height') : 40)
          .enabled(this.passwordArr.length > 1)
          .opacity(deviceInfo.deviceType === 'tablet' ? 1 : (this.passwordArr.length > 1 ? 1 : 0.4))
          .onClick(() => {
            Log.showInfo(TAG, `onClick`)
            this.mViewModel.onAuthPassword(() => {
              Log.showInfo(TAG, `onClick callback promptText:${JSON.stringify(this.mViewModel.prompt)}`)
            });
          })
          .margin({ top: deviceInfo.deviceType === 'tablet' ? $r('sys.float.ohos_id_elements_margin_vertical_l') : 16 })
      }
      .width(Constants.FULL_CONTAINER_WIDTH)
      .height(deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_input_area_height') : 138)
      .margin({ bottom: deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_passwdmask_margin_bottom') : 71 })

      Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.End }) {
        NumkeyBoard({
          viewModel: this.mViewModel,
          onKeypress: (index, callback) => this.mViewModel.onKeyPress(index, callback)
        })
      }
      .width(Constants.FULL_CONTAINER_WIDTH)
      .height($r('app.float.custompsd_key_area_height'))
      .margin({ bottom: deviceInfo.deviceType === 'tablet' ? $r('app.float.custompsd_key_area_margin_bottom') : 52 })
    }
    .width(Constants.FULL_CONTAINER_WIDTH)
  }
}
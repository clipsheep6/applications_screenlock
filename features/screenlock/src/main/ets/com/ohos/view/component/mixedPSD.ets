import Log from '../../../../../../../../../common/src/main/ets/default/Log'
import Constants from '../../common/constants'
import ViewModel from '../../vm/mixedPSDViewModel'
import deviceInfo from '@ohos.deviceInfo';

const DEVICETYPE = deviceInfo.deviceType;
const TAG = 'ScreenLock-MixedPSD'

@Component
export default struct MixedPSD {
  @State mViewModel: ViewModel = new ViewModel()

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
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Start }) {
      Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
        Text(this.mViewModel.prompt)
          .fontSize($r('app.float.mixedpsd_prompt_fontsize'))
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .margin({
            bottom: $r('app.float.mixedpsd_prompt_margin_bottom'),
            top: $r("app.float.mixedpsd_prompt_margin_top")
          })
          .textAlign(TextAlign.Center)
          .textOverflow({ overflow: TextOverflow.None })
          .width($r('app.float.mixedpsd_prompt_width'))
          .height($r('app.float.mixedpsd_prompt_height'))

        TextInput({ placeholder: '', text: this.mViewModel.password })
          .type(InputType.Password)
          .maxLength(Constants.PASSWORD_MAX_LEN)
          .fontSize($r('app.float.mixedpsd_prompt_text_fontsize'))
          .width($r('app.float.mixedpsd_input_width'))
          .height($r('app.float.mixedpsd_input_height'))
          .backgroundColor(Color.Gray)
          .fontColor(Color.White)
          .enterKeyType(EnterKeyType.Done)
          .border({ width: 2, color: Color.Gray, radius: 15 })
          .enabled(!this.mViewModel.inhibitInput)
          .onChange(this.mViewModel.onInputChange.bind(this.mViewModel))
          .onSubmit((entryKey) => {
            this.mViewModel.onAuthPassword(() => {
              Log.showInfo(TAG, `onSubmit callback prompt:${this.mViewModel.prompt} inhibitInput:${this.mViewModel.inhibitInput}`)
            })
          })
          .margin({ bottom: $r('app.float.mixedpsd_input_margin_bottom') })

        Button('确认', {
          type: ButtonType.Capsule,
          stateEffect: true
        })
          .width($r('app.float.mixedpsd_input_width'))
          .height($r('app.float.mixedpsd_input_height'))
          .fontSize($r('app.float.mixedpsd_prompt_fontsize'))
          .backgroundColor('#0a59f7')
          .fontWeight(FontWeight.Medium)
          .fontColor(Color.White)
          .borderRadius(Constants.PASSWORD_TEXT_BORDER)
          .onClick(() => {
            Log.showInfo(TAG, `onClick`)
            this.mViewModel.onAuthPassword(() => {
              Log.showInfo(TAG, `onClick callback prompt:${this.mViewModel.prompt} inhibitInput:${this.mViewModel.inhibitInput}`)
            });
          })
          .margin({ top:  $r('sys.float.ohos_id_elements_margin_vertical_l'),bottom: $r('app.float.mixedpsd_input_margin_bottom')})

        Text($r('app.string.emergency_call'))
          .fontSize($r('app.float.mixedpsd_prompt_fontsize'))
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .textAlign(TextAlign.Center)
          .textOverflow({ overflow: TextOverflow.None })
          .onClick(this.mViewModel.onCallPhone.bind(this.mViewModel));
      }
      .width(Constants.FULL_CONTAINER_WIDTH)
      .height(Constants.FULL_CONTAINER_HEIGHT)

    }
    .width(Constants.FULL_CONTAINER_WIDTH)
    .height(Constants.FULL_CONTAINER_HEIGHT)
  }
}
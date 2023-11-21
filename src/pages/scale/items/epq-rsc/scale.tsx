import { useEffect, useState } from 'react'
import { Dialog, NoticeBar, Form, Radio, Button, DatePicker } from 'antd-mobile'
import { randomChoice, randomInt } from '~/utils'
import Question from './question'
import { calculateAge, calculateEpqRscResult } from '.'
import { useNavigate } from 'react-router-dom'

interface EpqRscProps {
  scale: Scale<EpqRscQuestion, EpqRscInterpretation>
  currentIndex: number
  values: EpqRscValue[]
  setValues: SetStateAction<EpqRscValue[]>
  setCalculateResult: SetStateAction<(values: EpqRscValue[]) => EpqRscResult>
}

const EpqRscScale = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: EpqRscProps) => {
  const navigate = useNavigate()

  const formIt = Form.useForm()

  const [showDialog, setShowDialog] = useState(
    process.env.NODE_ENV === 'development' ? false : true,
  )
  const [gender, setGender] = useState<keyof EpqRscNorm | null>(null)
  const [age, setAge] = useState(0)

  const [datePickerState, setDatePickerState] = useState<{
    minDate: number
    maxDate: number
    currentDate?: number
  }>({
    minDate: new Date(1980, 0, 1).getTime(),
    maxDate: new Date().getTime(),
    currentDate: undefined,
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    setCalculateResult(() => {
      return (vs: EpqRscValue[]) => {
        const norm = (scale.interpretation as EpqRscInterpretation).norm

        if (process.env.NODE_ENV === 'development') {
          return calculateEpqRscResult(
            vs,
            randomInt(43, 100),
            norm[
            randomChoice([
              'male',
              'female',
            ]) as keyof EpqRscInterpretation['norm']
            ],
          )
        }

        return calculateEpqRscResult(vs, age, norm[gender!])
      }
    })
  }, [age, gender])

  const updateValues = (index: number, value: EpqRscValue) => {
    setValues((prev) => {
      const arr = [...prev]

      arr[index] = value

      return arr
    })
  }

  useEffect(() => {
    process.env.NODE_ENV === 'development' &&
      values.length < scale.questions.length &&
      scale.questions.forEach((v, i) => {
        updateValues(i, {
          dimension: v.dimension,
          point: randomChoice(v.options, 'point'),
        })
      })
  }, [])

  if (!scale || currentIndex === -1) {
    return null
  }

  const onConfirmDate = (val: Date) => {
    console.log(val)
    // setAge(calculateAge(new Date(datePickerState.currentDate)))
    // setShowDatePicker(false)
  }

  const beforeCloseDialog = (action: string) => {
    if (action === 'confirm') {
      // if (!gender || !age) {
      //   !gender && formIt.setErrorMessage('gender', '请选择您的性别')
      //   !age && formIt.setErrorMessage('date', '请选择您的出生日期')
      //
      //   return
      // }

      setShowDialog(false)

      return
    }

    navigate('/', { replace: true })
  }

  const currentQuestion = scale.questions[currentIndex]

  return (
    <div>
      <Dialog
        visible={showDialog}
        content={
          <>
            <NoticeBar
              wrap
              content="您的测试结果本小程序不会保存，请一定根据自己的实际情况回答，否则测试结果不具有参考性。"
            />

            <Form layout="horizontal">
              <Form.Item label="您的性别" name="gender">
                <Radio.Group>
                  <Radio value="male">男</Radio>

                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="date" label={age ? '您的年龄' : '出生日期'}>
                {age ? (
                  <span>{age}</span>
                ) : (
                  <Button
                    size="small"
                    style={{ margin: 0, height: '1.5rem' }}
                    onClick={() => setShowDatePicker(true)}
                  >
                    选择日期
                  </Button>
                )}
              </Form.Item>
            </Form>
          </>
        }
      />

      <DatePicker
        title="日期选择"
        visible={showDatePicker}
        onClose={() => {
          setShowDatePicker(false)
        }}
        max={new Date()}
        onConfirm={(val) => {
          onConfirmDate(val)
        }}
      />

      <Question
        {...currentQuestion}
        index={currentIndex}
        value={values[currentIndex]}
        updateValues={updateValues}
        dimension={scale.questions[currentIndex].dimension}
      />
    </div>
  )
}

export default EpqRscScale

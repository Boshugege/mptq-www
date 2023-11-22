import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NavBar, Grid, Button, NoticeBar } from 'antd-mobile'
import suspense from '~/advance/suspense'
import {
  Lazy16pfScale,
  LazyCommonScale,
  LazyEPTScale,
  LazyEptRscScale,
  LazyIdea,
  LazySCL90Scale,
  LazyYBocsScale,
} from '~/pages'
import { api } from '~/utils'
import './index.scss'
import Alert from '~/components/alert'

const Scale = () => {
  const { path } = useParams() as { path: Path }

  const [scale, setScale] = useState<Scale<
    InferQuestion<typeof path>,
    InferInterpretation<typeof path>
  > | null>(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [values, setValues] = useState<InferValue<typeof path>[]>([])
  const [calculateResult, setCalculateResult] = useState<CalculateResult<
    typeof path
  > | null>(null)

  const [instruction, setInstruction] = useState<ReactNode[]>([
    <NoticeBar
      color="alert"
      content="您的测试结果本小程序不会保存，请一定根据自己的实际情况回答，否则测试结果不具有参考性。"
    />,
  ])

  const [autoNext, setAutoNext] = useState(true)

  const [renderScale, setRenderScale] = useState(false)

  useEffect(() => {
    api<Scale<InferQuestion<typeof path>, InferInterpretation<typeof path>>>(
      '/' + path,
    ).then((data) => {
      setScale(data)
      setCurrentIndex(0)
    })
  }, [])

  const navigate = useNavigate()

  const turnOffAutoNext = () => {
    autoNext && setAutoNext(false)
  }

  const turnOnAutoNext = useCallback(() => {
    !autoNext && setAutoNext(true)
  }, [autoNext])

  const toPrev = () => {
    turnOffAutoNext()

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const toNext = useCallback(() => {
    currentIndex < scale!.questions.length - 1 &&
      values[currentIndex] !== undefined && // 防止用户点击太快向 values 添加 undefined
      setCurrentIndex((prev) => prev + 1)

    // 切换到未答题目时开启自动切换
    currentIndex + 1 === values.length && turnOnAutoNext()
  }, [currentIndex, scale, turnOnAutoNext, values])

  useEffect(() => {
    if (
      autoNext &&
      values[currentIndex] !== undefined &&
      values[currentIndex + 1] === undefined
    ) {
      // 延迟 50ms 切换下一题，方便 radio 渲染完成
      const timer = setTimeout(() => toNext(), 50)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, values])

  useEffect(() => {
    if (!scale) return
    if (!scale.instruction && !scale.warning) return

    const message = scale.instruction ?? scale.warning

    setInstruction((pre) => {
      const texts = typeof message === 'string' ? [message!] : message!

      return [...pre, ...texts]
    })
  }, [scale])

  if (!scale || currentIndex === -1) {
    return null
  }

  const onSubmit = () => {
    const result = calculateResult!(values)

    switch (path) {
      case 'scl90':
      case '16pf':
      case 'y_bocs':
      case 'ept':
      case 'epq_rsc':
        navigate('/result/' + path, {
          replace: true,
          state: {
            result,
            interpretation: scale.interpretation,
            name: scale.name,
          },
        })
        return
      default: {
        const result = calculateResult!(values) as InferResult<typeof path>

        const interpretation = (
          scale?.interpretation as CommonInterpretation
        ).find((v) => result >= v.range[0] && result <= v.range[1])

        navigate('/result/' + path, {
          replace: true,
          state: {
            name: scale.name,
            interpretation,
            result,
          },
        })

        return
      }
    }
  }

  const render = () => {
    switch (path) {
      case '16pf':
        return (
          <Lazy16pfScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        )

      case 'scl90':
        return (
          <LazySCL90Scale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        )

      case 'y_bocs':
        return (
          <LazyYBocsScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCurrentIndex={setCurrentIndex}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        )

      case 'ept':
        return (
          <LazyEPTScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        )

      case 'epq_rsc':
        return (
          <LazyEptRscScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        )

      default:
        return (
          <LazyCommonScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        )
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <NavBar onBack={() => navigate('/', { replace: true })}>
        {scale.name}
      </NavBar>

      <div className="container">
        {scale.idea ? (
          suspense(
            <LazyIdea
              content={scale.idea}
              hide={() =>
                setScale(
                  (pre) =>
                    ({ ...pre, idea: null }) as Scale<
                      InferQuestion<typeof path>,
                      InferInterpretation<typeof path>
                    >,
                )
              }
            />,
          )
        ) : (
          <>
            <Alert
              title="测试需知"
              wait={5}
              content={instruction}
              onClose={() => setRenderScale(true)}
              defaultShow
            />
            {renderScale ? suspense(render()) : null}
            <Grid columns={12} gap={8} style={{ marginTop: 10 }}>
              <Grid.Item span={5}>
                <Button
                  block
                  shape="default"
                  color="primary"
                  onClick={toPrev}
                  disabled={currentIndex === 0}
                >
                  上一题
                </Button>
              </Grid.Item>
              <Grid.Item
                span={2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>{currentIndex + 1 + '/' + scale.questions.length}</span>
              </Grid.Item>
              <Grid.Item span={5}>
                <Button
                  block
                  shape="default"
                  color="primary"
                  onClick={toNext}
                  disabled={
                    values[currentIndex] === undefined ||
                    currentIndex === scale.questions.length - 1
                  }
                >
                  下一题
                </Button>
              </Grid.Item>
            </Grid>

            {values.length === scale.questions.length ? (
              <Button
                block
                color="success"
                className="submit"
                onClick={onSubmit}
              >
                查看结果
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export default Scale

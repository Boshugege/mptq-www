import { Chart, Axis, Area, Point, Line } from '@antv/f2'
import Canvas from '@antv/f2-react'
import { getMaxIndexes, getMinIndexes } from '~/utils'
import { generateColors, Color } from '~/utils/color'
import { types } from '~/pages/scale/items/ept'
import { useLocation } from 'react-router-dom'
import Alert from '~/components/alert'
import EptType from './type'

type Interpretations = { [K in EptTypes]: EptInterpretationItem }

interface RadarChartProps {
  max: number
  data: { item: string; yes: number; no: number }[]
  emphasize?: string[]
}

const yesBaseColor = new Color(129, 100, 32)
const yesColors = generateColors(9, yesBaseColor)
const noBaseColor = new Color(33, 73, 64)
const noColors = generateColors(9, noBaseColor)

const RadarChart = ({ max, data, emphasize }: RadarChartProps) => {
  const sorted = [...data].sort((a, b) => b.yes - a.yes)

  return (
    <Chart
      data={data}
      coord={{
        type: 'polar',
        radius: 1,
      }}
      scale={{
        yes: {
          min: 0,
          max: max,
          nice: true,
          // tickCount: max + 1,
          tickCount: Math.ceil(max / 3),
        },
      }}
    >
      <Axis
        field="item"
        style={{
          label: (text) => {
            const isEmphasize = emphasize?.includes(text)
            return {
              fontSize: isEmphasize ? 18 : 12,
              color: isEmphasize ? '#000' : '#ccc',
              fontWeight: isEmphasize ? 'bold' : 'lighter',
            }
          },
        }}
      />

      <Axis field="yes" />

      <Line x="item" y="yes" color={yesBaseColor.hex()} />

      <Line x="item" y="no" color={noBaseColor.hex()} />

      <Area x="item" y="yes" color={yesBaseColor.hex()} />

      <Area x="item" y="no" color={noBaseColor.hex()} />

      <Point
        x="item"
        y="yes"
        color={{
          field: 'item',
          callback: (v: string) => {
            const color = yesColors[sorted.findIndex((i) => i.item === v)]

            return color
          },
        }}
      />

      <Point
        x="item"
        y="no"
        color={{
          field: 'item',
          callback: (v: string) => {
            const color = noColors[sorted.findIndex((i) => i.item === v)]

            return color
          },
        }}
      />
    </Chart>
  )
}

const EptResult = () => {
  const location = useLocation()
  const {
    result,
    interpretation: originalInterpretation,
  }: {
    result: EptResult
    interpretation: EptInterpretation
  } = location.state

  const interpretation = originalInterpretation.type_interpretations.reduce(
    (acc, item) => {
      acc[item.type] = item

      return acc
    },
    {} as Interpretations,
  )

  const maxIndexes = getMaxIndexes(result, 'total', 'yes')
  // 存在多个最大值时，no 值较小者为最可能的人格
  const typeIndexes =
    maxIndexes.length === 1
      ? [maxIndexes[0]]
      : getMinIndexes(
        maxIndexes.map((i) => result[i]),
        'total',
        'no',
      ).map((i) => maxIndexes[i])

  const chartProps: RadarChartProps = {
    max: result[maxIndexes[0]].total.yes,
    data: result.map((v) => ({ item: v.label, ...v.total })),
    emphasize: typeIndexes.map((i) => types[i].label),
  }

  return (
    <div className="container text">
      <div
        id="chart"
        style={{ width: '100%', height: '20rem', position: 'relative' }}
      >
        <Canvas pixelRatio={window.devicePixelRatio}>
          <RadarChart {...chartProps} />
        </Canvas>
      </div>

      <EptType
        interpretations={typeIndexes.map((i) => ({
          ...interpretation[types[i].type],
          label: types[i].label,
        }))}
      />

      <Alert
        title="必读"
        warning={
          typeIndexes.length > 1
            ? '本测试通常不会有两个或以上结果，但您的测试结果存在 ' +
            `${typeIndexes.length} 个匹配的人格类型，故本次测试` +
            '可能不具参考性，请重新认真测试。'
            : undefined
        }
        content={originalInterpretation.dialog.concat([
          '如果你觉得测试结果与你严重不相符，请重新测试并认真审视每道题目，如果多次测试的结果相同，那可能你需要重新认识自己。',
        ])}
        wait={10}
        defaultShow
      />
    </div>
  )
}

export default EptResult

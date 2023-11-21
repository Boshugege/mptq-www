import { lazy } from 'react'

export const LazyHome = lazy(() => import('~/pages/list/index'))
export const LazyQuestion = lazy(() => import('~/pages/scale/question/index'))

export const LazyCommonQuestion = lazy(
  () => import('~/pages/scale/items/common/question'),
)
export const LazyCommonScale = lazy(
  () => import('~/pages/scale/items/common/scale'),
)

export const Lazy16pfQuestion = lazy(
  () => import('~/pages/scale/items/16pf/question'),
)
export const Lazy16pfScale = lazy(
  () => import('~/pages/scale/items/16pf/scale'),
)

export const LazySCL90Question = lazy(
  () => import('~/pages/scale/items/scl90/question'),
)
export const LazySCL90Scale = lazy(
  () => import('~/pages/scale/items/scl90/scale'),
)

export const LazyYBocsQuestion = lazy(
  () => import('~/pages/scale/items/y-bocs/question'),
)
export const LazyYBocsScale = lazy(
  () => import('~/pages/scale/items/y-bocs/scale'),
)

export const LazyEPTQuestion = lazy(
  () => import('~/pages/scale/items/ept/question'),
)
export const LazyEPTScale = lazy(() => import('~/pages/scale/items/ept/scale'))

export const LazyEptRscQuestion = lazy(
  () => import('~/pages/scale/items/epq-rsc/question'),
)
export const LazyEptRscScale = lazy(
  () => import('~/pages/scale/items/epq-rsc/scale'),
)

export const LazyScale = lazy(() => import('~/pages/scale/index'))

export const LazyCircle = lazy(() => import('~/pages/result/components/circle'))

export const LazyResult = lazy(() => import('~/pages/result/index'))
export const LazyCommonResult = lazy(
  () => import('~/pages/result/common/index'),
)
export const LazySCL90Result = lazy(() => import('~/pages/result/scl90/index'))
export const Lazy16pfResult = lazy(() => import('~/pages/result/16pf/index'))
export const LazyYbocsResult = lazy(() => import('~/pages/result/y-bocs/index'))
export const LazyEPTResult = lazy(() => import('~/pages/result/ept/index'))
export const LazyEpqRscResult = lazy(
  () => import('~/pages/result/epq-rsc/index'),
)

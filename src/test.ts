// import 'redux'

// eslint-disable-next-line
interface Action {}

// eslint-disable-next-line
interface AnyAction extends Action {}

// eslint-disable-next-line
type ThunkAction< A, B, C, D> = A | B | C | D

// @ts-expect-error TS2664
declare module 'redux' {
  interface Dispatch<A extends Action = AnyAction> {
    <S, E, R>(asyncAction: ThunkAction<R, S, E, A>): R
  }
}


//import 'redux'
// @ts-expect-error fail TS2664
declare module 'redux' {
  type Dispatch<A extends Action = AnyAction> = <S, E, R>(asyncAction: ThunkAction<R, S, E, A>) => R
}

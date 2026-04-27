export type PageParams = {
  limit: string
  offset: string
}

export type OnlyOutput<O> = () => Promise<O>
export type InputAndOutput<I, O> = (i: I) => Promise<O>
export type MultiString = string[] | string
export type Paginated<Param, O> = InputAndOutput<
  Param & PageParams,
  {
    more: boolean
    data: O
  }
>

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : never

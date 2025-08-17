import { computed, sleep, wrap } from "@reatom/core"
import { withAsyncData } from "@reatom/core"

import { productsMock } from "./mocks"

export const getProductsAction = computed(async () => {
  await wrap(sleep(2000))

  return await wrap(productsMock)
}).extend(withAsyncData({ initState: [] }))

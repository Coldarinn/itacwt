import { computed, sleep, wrap } from "@reatom/core"
import { withAsyncData } from "@reatom/core"

import { pricePlansMock } from "./mocks"

export const getPricePlansAction = computed(async () => {
  await wrap(sleep(2000))

  return await wrap(pricePlansMock)
}).extend(withAsyncData({ initState: [] }))

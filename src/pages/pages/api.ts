import { computed, sleep, wrap } from "@reatom/core"
import { withAsyncData } from "@reatom/core"

import { pagesMock } from "./mocks"

export const getPagesAction = computed(async () => {
  await wrap(sleep(2000))

  return await wrap(pagesMock)
}).extend(withAsyncData({ initState: [] }))

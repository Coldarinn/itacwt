import { SIZES } from "./utils"

const words = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "elit",
  "enim",
  "proident",
  "culpa",
  "ad",
  "nostrud",
  "aliqua",
  "eu",
  "esse",
  "sunt",
  "voluptate",
  "do",
  "quis",
  "id",
  "in",
]

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const randomName = () => {
  const wordCount = Math.floor(Math.random() * 3) + 1
  return Array.from({ length: wordCount }, () => words[Math.floor(Math.random() * words.length)]).join(" ")
}

export const productsMock = Array.from({ length: 500 }, () => ({
  id: Math.floor(Math.random() * 1_000_000_00),
  name: randomName(),
  options: {
    size: SIZES[Math.floor(Math.random() * SIZES.length)],
    amount: Math.floor(Math.random() * 1000),
  },
  active: Math.random() > 0.5,
  createdAt: randomDate(new Date(1950, 0, 1), new Date()).toISOString(),
}))

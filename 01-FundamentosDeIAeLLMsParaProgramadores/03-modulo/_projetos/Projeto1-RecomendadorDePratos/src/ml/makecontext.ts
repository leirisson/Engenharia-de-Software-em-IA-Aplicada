

export interface Dish {
    id: number
    name: string
    category: string
    price: number
    spicy: string
    description: string
    image: string
}

export interface User {
    id: number
    name: string
    age: number
    budget: number
    likedDishes: string[]
}

export const normalize = (value: number, minValue: number, maxValue: number) => ((value - minValue) / (maxValue - minValue) || 1)
// budget = orçamento | dishes = pratos
export function makeContext(dishes: Dish[], users: User[]) {
    // ── NUMÉRICAS ──────────────────────────────────────────
    const ages = users.map(u => u.age)
    const budgets = users.map(u => u.budget)
    const prices = dishes.map(d => d.price)

    const minAge = Math.min(...ages)
    const maxAge = Math.max(...ages)
    const minBudget = Math.min(...budgets)
    const maxBudget = Math.max(...budgets)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    // ── CATEGÓRICAS ────────────────────────────────────────
    const categories = [...new Set(dishes.map(dishe => dishe.category))]
    const spicyOption = [...new Set(dishes.map(dishe => dishe.spicy))]

    const categoryIndex = Object.fromEntries(categories.map((category, index) => [category, index]))
    const spicyIndex = Object.fromEntries(spicyOption.map((spicy, index) => [spicy, index]))


    // ── DIMENSIONS ─────────────────────────────────────────
    // [ageNorm, budgetNorm, priceNorm, ...categories, ...spicy]
    //     1          1          1      categories.length  spicy.length

    const dimensions = 3 + categories.length + spicyOption.length

    return {
        dishes,
        users,
        minAge,
        maxAge,
        minPrice,
        maxPrice,
        minBudget,
        maxBudget,
        categories,
        categoryIndex,
        spicyOption,
        spicyIndex,
        numcategories: categories.length,
        numSpicy: spicyOption.length,
        dimensions
    }





}
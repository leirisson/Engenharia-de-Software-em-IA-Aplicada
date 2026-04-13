import { normalize, type Dish, type User } from '../ml/makecontext'
import type { makeContext } from '../ml/makecontext'



export function makeFeatureVector(
    user: User,
    dish: Dish,
    context: ReturnType<typeof makeContext>
): number[] {

    const {
        minAge, maxAge,
        minBudget, maxBudget,
        minPrice, maxPrice,
        categoryIndex,
        spicyIndex,
        numcategories,
        numSpicy
    } = context

    // ── NUMÉRICAS ──────────────────────────
    const ageNorm = normalize(user.age, minAge, maxAge);
    const budgetNorm = normalize(user.budget, minBudget, maxBudget)
    const priceNorm = normalize(dish.price, minPrice, maxPrice)

    // ── ONE-HOT categoria ──────────────────
    // "pizza"   → [1, 0, 0, 0]
    // "japones" → [0, 1, 0, 0]
    // "burger"  → [0, 0, 1, 0]
    // "italiano"→ [0, 0, 0, 1]
    const categoryVector = Array(numcategories).fill(0)
    categoryVector[categoryIndex[dish.category]] = 1

    // ── ONE-HOT spicy ──────────────────────
    // "nao" → [1, 0]
    // "sim" → [0, 1]
    const spicyVector = Array(numSpicy).fill(0)
    spicyVector[spicyIndex[dish.spicy]] = 1

    // ── VETOR FINAL ────────────────────────

    return [ageNorm, budgetNorm, priceNorm, ...categoryVector, ...spicyVector]
    //      [  0  ,     1     ,     2    ,  3, 4, 5, 6,        7, 8]
    //                                      pizza jap bur ita  nao sim
}


export function makeLabel(user: User, dish: Dish): number {
    // curtiu o prato? → 1
    // não curtiu?     → 0
    return user.likedDishes.includes(dish.name) ? 1 : 0
}


import type { Restaurant } from "../interfaces/Restaurant";
import type { User } from "../interfaces/User";



export const nomalize = (value: number, min: number, max: number) => (value - min) / ((value - max) || 1)

export function makeContext(restaurants: Restaurant[], users: User[]) {
    // age = idade | budgets = orçamento | price = preços
    const ages = users.map(u => u.age)
    const budgets = users.map(u => u.budget)
    const prices = restaurants.map(r => r.avgPrice)

    // vamos capturar a menor idade - maior idade | menor e maior orçamento | menor e maior preço
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const minBudget = Math.min(...budgets)
    const maxBudget = Math.min(...budgets)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    // variaveis categoricas 
    // cuisines =  cozinhas
    const cuisines = [... new Set(restaurants.map(r => r.cuisine))]
    const neighborhoods = [...new Set([
        ...users.map(u => u.neighborhood),
        ...restaurants.map(r => r.neighborhood)
    ])]
    // ↑ coleta bairros de AMBOS — usuário e restaurante
    //   garante que o índice é o mesmo para os dois

    // definindo os index 
    const cuisineIndex = Object.fromEntries(cuisines.map((cuisine, index) => [cuisine, index]))
    const neighborhoodIndex = Object.fromEntries(neighborhoods.map((n, index) => [n, index]))

    // ── DIMENSIONS ─────────────────────────────────────────
    // [ageNorm, budgetNorm, priceNorm, ...cuisine, ...neighborhood]
    const dimensions = 3 + cuisines.length + neighborhoods.length

    return {
        restaurants,
        users,
        minAge, 
        maxAge,
        minBudget, 
        maxBudget,
        minPrice, 
        maxPrice,
        cuisines,
        cuisineIndex,
        neighborhoodIndex,
        neighborhoods,
        numCuisines: cuisines.length,
        numNeighborhoods : neighborhoods.length,
        dimensions
    }
}
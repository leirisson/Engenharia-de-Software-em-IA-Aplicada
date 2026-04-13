import type { VisitedRestaurant } from "./VisitedRestaurant"

export interface User {
  id: number
  name: string
  age: number
  budget: number
  neighborhood: string  // ← novidade — usuário também tem bairro
  visitedRestaurants: VisitedRestaurant[]
}
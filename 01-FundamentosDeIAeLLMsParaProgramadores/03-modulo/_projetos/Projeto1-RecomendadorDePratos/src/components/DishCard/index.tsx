import type { Dish } from "../../ml/makecontext";
import { ScoreBar } from "../ScoreBar";

const CATEGORY_EMOJI: Record<string, string> = {
  pizza: "🍕",
  japones: "🍣",
  burger: "🍔",
  italiano: "🍝",
};
 
const CATEGORY_COLOR: Record<string, string> = {
  pizza: "#f97316",
  japones: "#06b6d4",
  burger: "#84cc16",
  italiano: "#a855f7",
};

export function DishCard({
  dish,
  score,
  rank,
}: {
  dish: Dish;
  score: number;
  rank: number;
}) {
  const color = CATEGORY_COLOR[dish.category] ?? "#6b7280";
  const emoji = CATEGORY_EMOJI[dish.category] ?? "🍽️";
  const isTop = rank === 0;
 
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${isTop ? color : "#e5e7eb"}`,
        borderRadius: 16,
        padding: "20px 22px",
        position: "relative",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isTop
          ? `0 8px 32px ${color}22`
          : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* rank badge */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 28,
          height: 28,
          borderRadius: 99,
          background: isTop ? color : "#f3f4f6",
          color: isTop ? "#fff" : "#9ca3af",
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {rank + 1}
      </div>
 
      {/* emoji */}
      <div style={{ fontSize: 32, marginBottom: 10, lineHeight: 1 }}>
        {emoji}
      </div>
 
      {/* name */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#111827",
          fontFamily: "'Fraunces', serif",
          marginBottom: 4,
          paddingRight: 32,
        }}
      >
        {dish.name}
      </div>
 
      {/* meta */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color,
            background: `${color}18`,
            padding: "2px 8px",
            borderRadius: 99,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {dish.category}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#9ca3af",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          R$ {dish.price}
        </span>
        {dish.spicy === "sim" && (
          <span style={{ fontSize: 11 }}>🌶️</span>
        )}
      </div>
 
      <ScoreBar score={score} color={color} />
    </div>
  );
}
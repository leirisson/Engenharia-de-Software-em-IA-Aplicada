import type { Dish } from "../../ml/makecontext";

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
  sorted,
}: {
  dish: Dish;
  score: number;
  rank: number;
  sorted: boolean;
}) {
  const color = CATEGORY_COLOR[dish.category] ?? "#6b7280";
  const emoji = CATEGORY_EMOJI[dish.category] ?? "🍽️";
  const isTop = sorted && rank === 0;
 
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${isTop ? color : "#e5e7eb"}`,
      borderRadius: 16,
      padding: "20px 22px",
      position: "relative",
      boxShadow: isTop ? `0 8px 32px ${color}22` : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "border 0.4s ease, box-shadow 0.4s ease",
      height: "100%",
    }}>
      {/* rank badge */}
      {sorted && (
        <div style={{
          position: "absolute",
          top: 16, right: 16,
          width: 28, height: 28,
          borderRadius: 99,
          background: isTop ? color : "#f3f4f6",
          color: isTop ? "#fff" : "#9ca3af",
          fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
        }}>
          {rank + 1}
        </div>
      )}
 
      <div style={{
        width: "100%",
        height: 140,
        borderRadius: 14,
        overflow: "hidden",
        background: "#f3f4f6",
        marginBottom: 14,
      }}>
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.style.display = "none";
          }}
        />
      </div>
 
      <div style={{ fontSize: 32, marginBottom: 10, lineHeight: 1 }}>{emoji}</div>
 
      <div style={{
        fontSize: 15, fontWeight: 600,
        color: "#111827",
        fontFamily: "'Fraunces', serif",
        marginBottom: 6,
        paddingRight: sorted ? 36 : 0,
      }}>
        {dish.name}
      </div>
 
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
        <span style={{
          fontSize: 11, fontWeight: 500,
          color, background: `${color}18`,
          padding: "2px 8px", borderRadius: 99,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
        }}>
          {dish.category}
        </span>
        <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>
          R$ {dish.price}
        </span>
        {dish.spicy === "sim" && <span style={{ fontSize: 11 }}>🌶️</span>}
      </div>
 
      {/* score bar */}
      {sorted && (
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 11, color: "#9ca3af",
            marginBottom: 4,
            fontFamily: "'DM Mono', monospace",
          }}>
            <span>MATCH</span>
            <span style={{ color, fontWeight: 600 }}>{(score * 100).toFixed(0)}%</span>
          </div>
          <div style={{ height: 3, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${score * 100}%`,
              background: color,
              borderRadius: 99,
              transition: "width 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

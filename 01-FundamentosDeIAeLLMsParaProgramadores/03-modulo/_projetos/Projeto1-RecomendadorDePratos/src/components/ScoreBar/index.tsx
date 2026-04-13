import { useState, useEffect } from "react";

export function ScoreBar({ score, color }: { score: number; color: string }) {
  const [width, setWidth] = useState(0);
 
  useEffect(() => {
    const t = setTimeout(() => setWidth(score * 100), 80);
    return () => clearTimeout(t);
  }, [score]);
 
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#9ca3af",
          marginBottom: 4,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.05em",
        }}
      >
        <span>MATCH</span>
        <span style={{ color, fontWeight: 600 }}>
          {(score * 100).toFixed(0)}%
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: "#f3f4f6",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}
 
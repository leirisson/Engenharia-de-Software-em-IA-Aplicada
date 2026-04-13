import type { User } from "../../ml/makecontext";


export function UserPill({
  user,
  active,
  onClick,
}: {
  user: User;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 99,
        border: `1.5px solid ${active ? "#111827" : "#e5e7eb"}`,
        background: active ? "#111827" : "#fff",
        color: active ? "#fff" : "#6b7280",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {user.name}
      <span
        style={{
          marginLeft: 6,
          fontSize: 11,
          opacity: 0.6,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {user.age}a
      </span>
    </button>
  );
}
import "./App.css";
// em cada arquivo ml/
// import * as tf from '@tensorflow/tfjs'

// no App.tsx
import * as tf from '@tensorflow/tfjs'
import { makeContext } from "../src/ml/makecontext";
import { useEffect, useRef, useState } from "react";
import { trainModel } from "../src/ml/trainModel";
import { recommend } from '../src/ml/recomend'
import type { User, Dish } from '../src/ml/makecontext'
import { DishCard } from "./components/DishCard";
import { UserPill } from "./components/UserPill";

type Recommendation = { dish: Dish, score: number }

function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [computing, setComputing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const modelRef = useRef<tf.Sequential | null>(null);
  const contextRef = useRef<ReturnType<typeof makeContext> | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const urls = ["../src/data/users.json", "../src/data/dishes.json"];
        const response = await Promise.all(urls.map((url) => fetch(url)));
        const [users, dishes] = await Promise.all(
          response.map((r) => r.json()),
        );

        const context = makeContext(dishes, users);
        const model = await trainModel(context);

        contextRef.current = context;
        modelRef.current = model;

        setUsers(users);
        setSelectedUser(users[0]);
        setLoading(false);

      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

  // recomenda sempre que o usuário muda
  useEffect(() => {
    if (selectedUser || !modelRef.current || !contextRef.current) return;
    async function runRecommend() {
      setComputing(true);
      const result = await recommend(
        selectedUser!,
        contextRef.current!,
        modelRef.current!,
      )
      setRecommendations(result);
      setComputing(false);
    }
  }, [selectedUser])

  // ── LOADING ──────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          fontFamily: "'DM Sans', sans-serif",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "2.5px solid #e5e7eb",
            borderTopColor: "#111827",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
          Treinando modelo...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

 return (
    <>
      {/* google fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafafa; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-grid > * {
          animation: fadeUp 0.4s ease both;
        }
        ${recommendations
          .map(
            (_, i) =>
              `.card-grid > *:nth-child(${i + 1}) { animation-delay: ${i * 0.04}s }`
          )
          .join("\n")}
      `}</style>
 
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "48px 24px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* header */}
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "#9ca3af",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
              marginBottom: 8,
            }}
          >
            Recomendador de Pratos — Projeto A
          </p>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#111827",
              fontFamily: "'Fraunces', serif",
              lineHeight: 1.2,
            }}
          >
            O que você vai{" "}
            <em style={{ fontStyle: "italic", color: "#6b7280" }}>
              querer comer
            </em>{" "}
            hoje?
          </h1>
        </div>
 
        {/* user selector */}
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'DM Mono', monospace",
              marginBottom: 12,
            }}
          >
            Selecione o usuário
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {users.map((u) => (
              <UserPill
                key={u.id}
                user={u}
                active={selectedUser?.id === u.id}
                onClick={() => setSelectedUser(u)}
              />
            ))}
          </div>
        </div>
 
        {/* selected user info */}
        {selectedUser && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 28,
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>
                Usuário selecionado
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#111827",
                  fontFamily: "'Fraunces', serif",
                }}
              >
                {selectedUser.name}
              </p>
            </div>
            <div
              style={{ width: 1, height: 32, background: "#e5e7eb" }}
            />
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>
                Idade
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {selectedUser.age} anos
              </p>
            </div>
            <div
              style={{ width: 1, height: 32, background: "#e5e7eb" }}
            />
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>
                Budget
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                R$ {selectedUser.budget}
              </p>
            </div>
            <div
              style={{ width: 1, height: 32, background: "#e5e7eb" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                Pratos que curtiu
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {selectedUser.likedDishes.map((d) => (
                  <span
                    key={d}
                    style={{
                      fontSize: 11,
                      background: "#f3f4f6",
                      color: "#374151",
                      padding: "2px 8px",
                      borderRadius: 99,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {/* section title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {computing ? "Calculando..." : `${recommendations.length} pratos ordenados por match`}
          </p>
        </div>
 
        {/* cards grid */}
        <div
          className="card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
            opacity: computing ? 0.4 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          {recommendations.map(({ dish, score }, i) => (
            <DishCard key={dish.id} dish={dish} score={score} rank={i} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

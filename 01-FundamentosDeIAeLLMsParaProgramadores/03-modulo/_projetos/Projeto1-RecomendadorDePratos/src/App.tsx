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

type Recommendation = { dish: Dish, score: number }

function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingEpoch, setTrainingEpoch] = useState<{ epoch: number; epochs: number } | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [computing, setComputing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const modelRef = useRef<tf.Sequential | null>(null);
  const contextRef = useRef<ReturnType<typeof makeContext> | null>(null);
  const [sorted, setSorted] = useState(false);
  const selectedUser = selectedUserId === null
    ? null
    : users.find((u) => u.id === selectedUserId) ?? null;

  useEffect(() => {
    async function init() {
      try {
        const urls = ["../src/data/users.json", "../src/data/dishes.json"];
        const response = await Promise.all(urls.map((url) => fetch(url)));
        const [usersData, dishesData] = (await Promise.all(
          response.map((r) => r.json()),
        )) as [User[], Dish[]];

        // estado inicial: todos os pratos desordenados, score 0
        setRecommendations(dishesData.map((dish) => ({ dish, score: 0 })));
        setUsers(usersData);
        setDishes(dishesData);
        setLoading(false);

      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

  async function handleTrainModel() {
    if (training || loading || dishes.length === 0 || users.length === 0) return;

    try {
      setTraining(true);
      setTrainingProgress(0);
      setTrainingEpoch({ epoch: 0, epochs: 0 });
      setSorted(false);
      setComputing(false);

      const context = makeContext(dishes, users);
      const model = await trainModel(context, {
        onProgress: (progress) => {
          setTrainingProgress(progress.progress);
          setTrainingEpoch({ epoch: progress.epoch, epochs: progress.epochs });
        },
      });

      contextRef.current = context;
      modelRef.current = model;
      setModelReady(true);
    } catch (error) {
      console.log(error);
      contextRef.current = null;
      modelRef.current = null;
      setModelReady(false);
    } finally {
      setTraining(false);
    }
  }

  // recomenda sempre que o usuário muda
  useEffect(() => {
    if (!selectedUser || !modelReady || !modelRef.current || !contextRef.current) return;
    const user = selectedUser;
    const context = contextRef.current;
    const model = modelRef.current;
    async function runRecommend() {
      setComputing(true)
      setSorted(false)

      const results = await recommend(
        user,
        context,
        model,
      )


      setTimeout(() => {
        setRecommendations(results);
        setSorted(true);
        setComputing(false);
      }, 300);
    }

    runRecommend()
  }, [selectedUser, modelReady])



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
          Carregando dados...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

 return (
    <>

      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafafa; }
 
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-wrap {
          animation: fadeUp 0.35s ease both;
        }
 
        .user-select {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .user-select:focus { border-color: #111827; }
 
        .train-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 40px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1.5px solid #111827;
          background: #111827;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .train-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .train-status {
          font-size: 11px;
          color: #6b7280;
          font-family: 'DM Mono', monospace;
        }
        .train-progress {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 360px;
        }
        .train-progress-track {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }
        .train-progress-bar {
          height: 100%;
          background: #111827;
          border-radius: 999px;
          transition: width 0.2s ease;
        }
        .train-progress-text {
          font-size: 11px;
          color: #6b7280;
          font-family: 'DM Mono', monospace;
          white-space: nowrap;
        }
 
        .grid {
          display: grid;
          gap: 14px;
          transition: opacity 0.2s ease;
        }

        @media (max-width: 519px) {
          .grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 520px) and (max-width: 819px) {
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 820px) and (max-width: 1079px) {
          .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        }
        @media (min-width: 1080px) {
          .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        }
      `}</style>
 
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 24px", fontFamily: "'DM Sans', sans-serif" }}>
 
        {/* header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontSize: 11, letterSpacing: "0.12em", color: "#9ca3af",
            textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8,
          }}>
            Projeto A — Recomendador de Pratos
          </p>
          <h1 style={{
            fontSize: 30, fontWeight: 600, color: "#111827",
            fontFamily: "'Fraunces', serif", lineHeight: 1.25,
          }}>
            O que você vai{" "}
            <em style={{ fontStyle: "italic", color: "#6b7280" }}>querer comer</em>{" "}
            hoje?
          </h1>
        </div>
 
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
          flexWrap: "wrap",
        }}>
          <button
            type="button"
            className="train-button"
            onClick={handleTrainModel}
            disabled={training || loading || dishes.length === 0 || users.length === 0}
          >
            {training ? "Treinando..." : modelReady ? "Re-treinar modelo" : "Treinar modelo"}
          </button>
          {training ? (
            <div className="train-progress">
              <div className="train-progress-track">
                <div
                  className="train-progress-bar"
                  style={{ width: `${Math.round(trainingProgress * 100)}%` }}
                />
              </div>
              <span className="train-progress-text">
                {Math.round(trainingProgress * 100)}%
                {trainingEpoch && trainingEpoch.epochs > 0 ? ` · ${trainingEpoch.epoch}/${trainingEpoch.epochs}` : ""}
              </span>
            </div>
          ) : (
            <span className="train-status">
              {modelReady ? "modelo pronto" : "modelo não treinado"}
            </span>
          )}
        </div>
 
        {/* select */}
        <div style={{ marginBottom: selectedUser ? 20 : 32 }}>
          <label style={{
            display: "block", fontSize: 11, color: "#9ca3af",
            textTransform: "uppercase", letterSpacing: "0.1em",
            fontFamily: "'DM Mono', monospace", marginBottom: 8,
          }}>
            Selecione o usuário
          </label>
          <select
            className="user-select"
            value={selectedUserId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedUserId(value ? Number(value) : null);
            }}
          >
            <option value="" disabled>Escolha um usuário...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.age} anos · Budget R$ {u.budget}
              </option>
            ))}
          </select>
          {!modelReady && (
            <p style={{
              marginTop: 10,
              fontSize: 12,
              color: "#6b7280",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Treine o modelo para calcular o match dos pratos.
            </p>
          )}
        </div>
 
        {/* info do usuário selecionado */}
        {selectedUser && (
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, padding: "14px 18px", marginBottom: 28,
            display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start",
          }}>
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Nome</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", fontFamily: "'Fraunces', serif" }}>
                {selectedUser.name}
              </p>
            </div>
            <div style={{ width: 1, background: "#e5e7eb", alignSelf: "stretch" }} />
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Idade</p>
              <p style={{ fontSize: 14, fontFamily: "'DM Mono', monospace" }}>{selectedUser.age} anos</p>
            </div>
            <div style={{ width: 1, background: "#e5e7eb", alignSelf: "stretch" }} />
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Budget</p>
              <p style={{ fontSize: 14, fontFamily: "'DM Mono', monospace" }}>R$ {selectedUser.budget}</p>
            </div>
            <div style={{ width: 1, background: "#e5e7eb", alignSelf: "stretch" }} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>Pratos que curtiu</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {selectedUser.likedDishes.map(d => (
                  <span key={d} style={{
                    fontSize: 11, background: "#f3f4f6", color: "#374151",
                    padding: "2px 8px", borderRadius: 99,
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {/* label do grid */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{
            fontSize: 11, color: "#9ca3af", textTransform: "uppercase",
            letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace",
          }}>
            {computing
              ? "Calculando match..."
              : sorted
              ? `${recommendations.length} pratos — ordenados por match`
              : `${recommendations.length} pratos disponíveis`}
          </p>
          {sorted && !computing && (
            <span style={{ fontSize: 11, color: "#22c55e", fontFamily: "'DM Mono', monospace" }}>
              ✓ ordenado
            </span>
          )}
        </div>
 
        {/* grid */}
        <div className="grid" style={{ opacity: computing ? 0.4 : 1 }}>
          {recommendations.map(({ dish, score }, i) => (
            <div
              key={dish.id}
              className="card-wrap"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <DishCard dish={dish} score={score} rank={i} sorted={sorted} />
            </div>
          ))}
        </div>
 
      </div>
    </>
  );
}

export default App;

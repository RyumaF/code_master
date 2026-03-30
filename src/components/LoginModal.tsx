"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
  onClose: () => void;
}

type Tab = "login" | "register";

export default function LoginModal({ onClose }: LoginModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "登録に失敗しました");
      return;
    }

    // Auto sign-in after registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("登録しましたがログインに失敗しました。ログインタブから再試行してください");
      setTab("login");
    } else {
      onClose();
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel p-6 rounded-2xl border border-studio-border bg-studio-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-audiowide text-lg">
              code<span className="text-amber-400">Master</span>
            </h2>
            <button
              onClick={onClose}
              className="text-studio-muted hover:text-white transition-colors font-mono"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-lg bg-studio-bg/60 border border-studio-border/50">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-mono text-sm transition-all ${
                  tab === t
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "text-studio-muted hover:text-white"
                }`}
              >
                {t === "login" ? "ログイン" : "新規登録"}
              </button>
            ))}
          </div>

          {/* Google Sign-in */}
          {process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== "false" && (
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-studio-border bg-studio-bg/40 hover:bg-studio-bg/80 hover:border-studio-muted transition-all font-mono text-sm text-white mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Googleでログイン
            </button>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-studio-border/60" />
            <span className="font-mono text-xs text-studio-muted">または</span>
            <div className="flex-1 h-px bg-studio-border/60" />
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, x: tab === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={tab === "login" ? handleLogin : handleRegister}
              className="flex flex-col gap-3"
            >
              {tab === "register" && (
                <div>
                  <label className="block font-mono text-xs text-studio-muted mb-1.5 tracking-widest uppercase">
                    ユーザー名 (任意)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: コードマスター"
                    className="w-full px-4 py-3 rounded-xl bg-studio-bg/60 border border-studio-border/60 text-white placeholder:text-studio-muted/50 font-mono text-sm focus:outline-none focus:border-amber-500/60 focus:bg-studio-bg transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-xs text-studio-muted mb-1.5 tracking-widest uppercase">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-studio-bg/60 border border-studio-border/60 text-white placeholder:text-studio-muted/50 font-mono text-sm focus:outline-none focus:border-amber-500/60 focus:bg-studio-bg transition-all"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-studio-muted mb-1.5 tracking-widest uppercase">
                  パスワード{tab === "register" ? " (8文字以上)" : ""}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={tab === "register" ? 8 : 1}
                  className="w-full px-4 py-3 rounded-xl bg-studio-bg/60 border border-studio-border/60 text-white placeholder:text-studio-muted/50 font-mono text-sm focus:outline-none focus:border-amber-500/60 focus:bg-studio-bg transition-all"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "処理中..."
                  : tab === "login"
                  ? "ログイン"
                  : "アカウント作成"}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Guest notice */}
          <p className="text-center font-mono text-xs text-studio-muted/60 mt-4">
            ログインしなくてもプレイできます
          </p>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}

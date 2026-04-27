/**
 * 🎮 Profile Page
 * User preferences editor with genre, platform, budget, and difficulty options.
 */

import React, { useState, useEffect } from "react";
import * as api from "../services/api";

const GENRES = ["Action", "RPG", "Strategy", "Puzzle", "Adventure", "Sports", "Simulation", "Indie", "Horror", "Platformer", "Fighting", "Shooter", "Racing", "Casual"];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
const BUDGETS = ["free", "budget", "premium", "any"];
const DIFFICULTIES = ["casual", "normal", "hard"];
const PLAYTIMES = ["casual", "regular", "hardcore"];

export default function ProfilePage({ onBack }) {
  const [profile, setProfile] = useState({
    favorite_genres: [],
    preferred_platforms: [],
    budget_range: "any",
    difficulty_preference: "normal",
    playtime_availability: "regular",
    multiplayer_interest: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getProfile().then((data) => {
      if (data.profile) setProfile((p) => ({ ...p, ...data.profile }));
    }).catch(() => {});
  }, []);

  function toggleArray(field, value) {
    setProfile((p) => {
      const arr = p[field] || [];
      return { ...p, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <button className="sidebar__footer-btn" onClick={onBack} style={{ flex: "none", padding: "8px 16px" }}>← Back to Chat</button>
        </div>
        <h1 className="profile-page__title">⚙️ Your Gaming Profile</h1>
        <p className="profile-page__subtitle">Help GameGuide AI understand your preferences for better recommendations.</p>
      </div>

      <div className="profile-card">
        <h2 className="profile-card__title">🎯 Favorite Genres</h2>
        <div className="profile-card__chips">
          {GENRES.map((g) => (
            <button key={g} className={`profile-card__chip ${(profile.favorite_genres || []).includes(g) ? "profile-card__chip--active" : ""}`} onClick={() => toggleArray("favorite_genres", g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-card">
        <h2 className="profile-card__title">🖥️ Preferred Platforms</h2>
        <div className="profile-card__chips">
          {PLATFORMS.map((p) => (
            <button key={p} className={`profile-card__chip ${(profile.preferred_platforms || []).includes(p) ? "profile-card__chip--active" : ""}`} onClick={() => toggleArray("preferred_platforms", p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-card">
        <h2 className="profile-card__title">💰 Budget & Difficulty</h2>
        <div className="profile-card__field">
          <label className="profile-card__label">Budget Range</label>
          <select className="profile-card__select" value={profile.budget_range} onChange={(e) => { setProfile((p) => ({ ...p, budget_range: e.target.value })); setSaved(false); }}>
            {BUDGETS.map((b) => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
          </select>
        </div>
        <div className="profile-card__field">
          <label className="profile-card__label">Difficulty Preference</label>
          <select className="profile-card__select" value={profile.difficulty_preference} onChange={(e) => { setProfile((p) => ({ ...p, difficulty_preference: e.target.value })); setSaved(false); }}>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
        </div>
        <div className="profile-card__field">
          <label className="profile-card__label">Play Time Availability</label>
          <select className="profile-card__select" value={profile.playtime_availability} onChange={(e) => { setProfile((p) => ({ ...p, playtime_availability: e.target.value })); setSaved(false); }}>
            {PLAYTIMES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div className="profile-card__field">
          <label className="profile-card__label" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={profile.multiplayer_interest || false} onChange={(e) => { setProfile((p) => ({ ...p, multiplayer_interest: e.target.checked })); setSaved(false); }} />
            Interested in multiplayer games
          </label>
        </div>
      </div>

      <button className="profile-card__save" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Preferences"}
      </button>
    </div>
  );
}

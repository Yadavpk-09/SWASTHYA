// client/src/pages/LeaderboardPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Trophy, Award, Flame, Zap, Crown, Medal, Lock, CheckCircle2, Star } from 'lucide-react';

export const LeaderboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('leaderboard'); // 'leaderboard' | 'badges'
  const [leaderboard, setLeaderboard] = useState([]);
  const [badgesData, setBadgesData] = useState({ badges: [], totalEarned: 0, totalAvailable: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lb, badges] = await Promise.all([
          api.gamification.getLeaderboard(),
          api.gamification.getBadges()
        ]);
        setLeaderboard(lb);
        setBadgesData(badges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const restUsers = leaderboard.slice(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '8px' }}>
          <Trophy size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            College Campus League
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Gamification & Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Compete with fellow campus peers, log daily workouts and wellness habits, and unlock prestigious tier badges.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button
          onClick={() => setTab('leaderboard')}
          style={{
            padding: '8px 20px',
            borderRadius: '10px',
            border: 'none',
            background: tab === 'leaderboard' ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.04)',
            color: tab === 'leaderboard' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Trophy size={16} />
          <span>Campus Rankings</span>
        </button>

        <button
          onClick={() => setTab('badges')}
          style={{
            padding: '8px 20px',
            borderRadius: '10px',
            border: 'none',
            background: tab === 'badges' ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.04)',
            color: tab === 'badges' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Award size={16} />
          <span>Badges Showcase ({badgesData.totalEarned}/{badgesData.totalAvailable})</span>
        </button>
      </div>

      {/* Leaderboard View */}
      {tab === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="podium-grid">
              {/* #2 Silver */}
              <div className="glass-panel" style={{
                padding: '24px 16px',
                textAlign: 'center',
                border: '1px solid rgba(148, 163, 184, 0.4)',
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                order: 1
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#94a3b8',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}>
                  #2
                </div>
                <img
                  src={top3[1].avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={top3[1].name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 8px auto', border: '2px solid #94a3b8' }}
                />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{top3[1].name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lvl {top3[1].level} • {top3[1].currentStreak}d Streak</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>{top3[1].points} XP</div>
              </div>

              {/* #1 Gold Champion */}
              <div className="glass-panel" style={{
                padding: '32px 16px',
                textAlign: 'center',
                border: '2px solid rgba(245, 158, 11, 0.6)',
                background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
                transform: 'scale(1.05)',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.25)',
                order: 2
              }}>
                <Crown size={28} color="#f59e0b" style={{ margin: '0 auto 4px auto' }} />
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}>
                  #1
                </div>
                <img
                  src={top3[0].avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'}
                  alt={top3[0].name}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 8px auto', border: '3px solid #f59e0b' }}
                />
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc' }}>{top3[0].name}</div>
                <div style={{ fontSize: '0.75rem', color: '#fcd34d' }}>Campus Champion • {top3[0].currentStreak}d Streak</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24', marginTop: '6px' }}>{top3[0].points} XP</div>
              </div>

              {/* #3 Bronze */}
              <div className="glass-panel" style={{
                padding: '24px 16px',
                textAlign: 'center',
                border: '1px solid rgba(217, 119, 6, 0.4)',
                background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                order: 3
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#d97706',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}>
                  #3
                </div>
                <img
                  src={top3[2].avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={top3[2].name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 8px auto', border: '2px solid #d97706' }}
                />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{top3[2].name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lvl {top3[2].level} • {top3[2].currentStreak}d Streak</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>{top3[2].points} XP</div>
              </div>
            </div>
          )}

          {/* Full Table */}
          <div className="glass-panel table-responsive-wrapper" style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>Rank</th>
                  <th style={{ padding: '12px' }}>Athlete</th>
                  <th style={{ padding: '12px' }}>Goal / Focus</th>
                  <th style={{ padding: '12px' }}>Streak</th>
                  <th style={{ padding: '12px' }}>Badges</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item) => {
                  const isCurrent = item.id === user?.id;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        background: isCurrent ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        fontWeight: isCurrent ? 700 : 500
                      }}
                    >
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: item.rank === 1 ? '#f59e0b' : item.rank === 2 ? '#94a3b8' : item.rank === 3 ? '#d97706' : 'rgba(255, 255, 255, 0.06)',
                          color: item.rank <= 3 ? '#0f172a' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '0.85rem'
                        }}>
                          #{item.rank}
                        </span>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={item.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                            alt={item.name}
                            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ color: isCurrent ? '#34d399' : '#f8fafc', fontSize: '0.9rem' }}>
                              {item.name} {isCurrent && '(You)'}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              Level {item.level} Athlete
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {item.goal || 'General Fitness'}
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171', fontSize: '0.85rem', fontWeight: 700 }}>
                          <Flame size={15} fill="#ef4444" />
                          <span>{item.currentStreak}d</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {item.earnedBadgesCount} unlocked
                      </td>

                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>
                          {item.points} XP
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Badges Showcase Tab */}
      {tab === 'badges' && (
        <div className="grid-cards-responsive">
          {badgesData.badges.map((b) => (
            <div
              key={b.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                border: b.unlocked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                background: b.unlocked ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)' : 'rgba(15, 23, 42, 0.4)',
                opacity: b.unlocked ? 1 : 0.65
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: b.unlocked ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: b.unlocked ? '#ffffff' : 'var(--text-muted)',
                boxShadow: b.unlocked ? '0 8px 20px rgba(16, 185, 129, 0.35)' : 'none',
                flexShrink: 0
              }}>
                {b.unlocked ? <Award size={26} /> : <Lock size={22} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge-pill ${b.unlocked ? 'badge-emerald' : 'badge-violet'}`} style={{ fontSize: '0.68rem' }}>
                    {b.category}
                  </span>
                  {b.unlocked && (
                    <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <CheckCircle2 size={13} />
                      <span>Unlocked</span>
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '4px', marginBottom: '4px' }}>
                  {b.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.4, marginBottom: '10px' }}>
                  {b.description}
                </p>

                <div style={{ fontSize: '0.75rem', color: b.unlocked ? '#fbbf24' : 'var(--text-muted)', fontWeight: 600 }}>
                  Reward: +{b.pointsReward} Points ({b.criteria})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

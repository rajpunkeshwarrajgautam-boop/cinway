"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import "./profiles.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Profiles = () => {
  const router = useRouter();
  const { data, mutate } = useSWR('/api/profiles', fetcher);
  const [isManaging, setIsManaging] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const profiles = data?.profiles || [];
  const avatarOptions = data?.avatarOptions || [];

  const selectProfile = useCallback(() => {
    router.push("/");
  }, [router]);

  const createProfile = async () => {
    if (!newProfileName.trim()) return;
    try {
      await axios.post('/api/profiles', {
        name: newProfileName,
        imageUrl: avatarOptions[selectedAvatar] || avatarOptions[0],
      });
      mutate();
      setShowCreateModal(false);
      setNewProfileName('');
    } catch (error) {
      console.error('Failed to create profile');
    }
  };

  const deleteProfile = async (profileId: string) => {
    if (profiles.length <= 1) return;
    try {
      await axios.delete('/api/profiles', { data: { profileId } });
      mutate();
    } catch (error) {
      console.error('Failed to delete profile');
    }
  };

  return (
    <div className="profilesContainer">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="profilesTitle">
          {isManaging ? 'Manage Profiles' : "Who's watching?"}
        </h1>
        <div className="profilesGrid">
          {profiles.map((profile: any) => (
            <div key={profile.id} onClick={() => !isManaging && selectProfile()}>
              <div className="profileItem">
                <div className="profileImageWrapper" style={{ position: 'relative' }}>
                  <Image
                    src={profile.imageUrl}
                    alt={profile.name}
                    width={200}
                    height={200}
                    className="profileImage"
                  />
                  {isManaging && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      {profiles.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProfile(profile.id); }}
                          style={{ background: 'rgba(229,9,20,0.8)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="profileName">{profile.name}</div>
              </div>
            </div>
          ))}

          {profiles.length < 5 && (
            <div onClick={() => setShowCreateModal(true)}>
              <div className="profileItem">
                <div className="profileImageWrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.2)' }}>
                  <Plus size={48} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="profileName">Add Profile</div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsManaging(!isManaging)}
          style={{
            marginTop: '2.5rem',
            padding: '0.6rem 2rem',
            border: '1px solid rgba(255,255,255,0.4)',
            background: 'transparent',
            color: 'white',
            fontSize: '1.1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
        >
          {isManaging ? 'Done' : 'Manage Profiles'}
        </button>
      </div>

      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '450px', position: 'relative' }}>
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Create Profile</h2>

            <input
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Profile name"
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '1rem', marginBottom: '1.5rem', outline: 'none' }}
            />

            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Choose an avatar:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {avatarOptions.map((url: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedAvatar(i)}
                  style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: selectedAvatar === i ? '3px solid #e50914' : '3px solid transparent', cursor: 'pointer', transition: 'border 200ms ease' }}
                >
                  <Image src={url} alt={`Avatar ${i + 1}`} width={100} height={100} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            <button
              onClick={createProfile}
              disabled={!newProfileName.trim()}
              style={{ width: '100%', padding: '0.75rem', background: '#e50914', color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', border: 'none', opacity: newProfileName.trim() ? 1 : 0.5 }}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;

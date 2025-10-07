import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { getIdToken, signOut } from 'firebase/auth'
import axios from 'axios'

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    email: '',
    nickName: '',
    address: '',
    city: '',
    country: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const user = auth.currentUser
      if (!user) {
        setError('Not logged in')
        setLoading(false)
        return
      }
      
      const idToken = await getIdToken(user)
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${idToken}` }
      })
      setProfile(res.data)
      
      // Initialize form data with profile data or defaults
      setFormData({
        fullName: res.data.displayName || '',
        gender: res.data.gender || '',
        email: res.data.email || '',
        nickName: res.data.nickName || '',
        address: res.data.address || '',
        city: res.data.city || '',
        country: res.data.country || ''
      })
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      const user = auth.currentUser
      if (!user) return
      
      const idToken = await getIdToken(user)
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, formData, {
        headers: { Authorization: `Bearer ${idToken}` }
      })
      
      setEditing(false)
      fetchProfile() // Refresh profile data
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update profile')
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div>Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: 500, 
        margin: '40px auto', 
        padding: 20, 
        backgroundColor: '#fee', 
        border: '1px solid #fcc', 
        borderRadius: 12,
        color: '#c33'
      }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            marginTop: 10
          }}
        >
          Go to Login
        </button>
      </div>
    )
  }

  if (!profile) return <div>No profile found</div>

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '20px 0'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 32,
          marginBottom: 24,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              Profile
            </h1>
            <button
              onClick={handleSignOut}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Sign Out
            </button>
          </div>

          {/* Profile Avatar and Basic Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 32
          }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #e5e7eb',
              position: 'relative'
            }}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                {formData.fullName || 'User'}
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: 0
              }}>
                I AM WEB DEVELOPER
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            paddingBottom: 12,
            borderBottom: '2px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Personal Information
            </h3>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                padding: '8px 16px',
                backgroundColor: editing ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 20 
          }}>
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'block',
                marginBottom: 6
              }}>
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontWeight: '500'
                }}>
                  {formData.fullName || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'block',
                marginBottom: 6
              }}>
                Gender
              </label>
              {editing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb'
                }}>
                  {formData.gender || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'block',
                marginBottom: 6
              }}>
                Email Address
              </label>
              <div style={{
                fontSize: '16px',
                color: '#1f2937',
                padding: '12px 16px',
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb'
              }}>
                {profile?.email || 'Not set'}
              </div>
            </div>

            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'block',
                marginBottom: 6
              }}>
                Nick Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.nickName}
                  onChange={(e) => setFormData({...formData, nickName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb'
                }}>
                  {formData.nickName || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'block',
                marginBottom: 6
              }}>
                City
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb'
                }}>
                  {formData.city || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'block',
                marginBottom: 6
              }}>
                Country
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb'
                }}>
                  {formData.country || 'Not set'}
                </div>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                display: 'block',
                marginBottom: 6
              }}>
                Address
              </label>
              {editing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: '16px',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb'
                }}>
                  {formData.address || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 24,
              gap: 12
            }}>
              <button
                onClick={handleSave}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>


        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginTop: 32
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Back to Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  )
}

import React from 'react';

const StandaloneThekedarDashboard = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#10b981',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            TH
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#065f46',
            margin: 0
          }}>
            Thekedar Hub
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '14px',
            color: '#64748b'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }}></div>
            <span>Online</span>
          </div>
          
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{
          width: '256px',
          backgroundColor: 'white',
          borderRight: '1px solid #e2e8f0',
          minHeight: 'calc(100vh - 65px)',
          padding: '1.5rem 0'
        }}>
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#10b981',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
              </div>
              <div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#1e293b',
                  margin: '0 0 0.25rem 0'
                }}>
                  Thekedar Hub
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  ramchandra
                </p>
              </div>
            </div>
          </div>

          <nav style={{ padding: '1rem 0' }}>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
                { id: 'site-visits', label: 'Site Visits', icon: '📍' },
                { id: 'team', label: 'My Team', icon: '👥' },
                { id: 'projects', label: 'Projects', icon: '🏗️' },
                { id: 'earnings', label: 'Earnings', icon: '💰' },
                { id: 'schedule', label: 'Schedule', icon: '📅' },
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map((item) => (
                <li key={item.id} style={{ marginBottom: '0.25rem' }}>
                  <a
                    href="#"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      textDecoration: 'none',
                      color: item.id === 'dashboard' ? 'white' : '#64748b',
                      backgroundColor: item.id === 'dashboard' ? '#10b981' : 'transparent',
                      fontWeight: item.id === 'dashboard' ? '600' : '400',
                      borderRadius: '0 24px 24px 0',
                      marginLeft: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (item.id !== 'dashboard') {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.color = '#1e293b';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (item.id !== 'dashboard') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#64748b';
                      }
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2rem' }}>
          {/* Welcome Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#065f46',
              margin: '0 0 0.5rem 0'
            }}>
              Welcome to Thekedar Hub
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#64748b',
              margin: 0
            }}>
              Manage your construction business efficiently
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {[
              { title: 'Upcoming Visits', value: '12', icon: '📍', change: '+12%', color: '#10b981' },
              { title: 'Active Projects', value: '8', icon: '🏗️', change: '+8%', color: '#3b82f6' },
              { title: 'Team Members', value: '15', icon: '👥', change: '+15%', color: '#8b5cf6' },
              { title: 'Monthly Earnings', value: '₹42,500', icon: '💰', change: '+18%', color: '#f59e0b' }
            ].map((stat, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      fontWeight: '500',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {stat.title}
                    </h3>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: '800', 
                      color: stat.color,
                      margin: '0 0 0.5rem 0'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#10b981',
                      fontWeight: '600'
                    }}>
                      ↑ {stat.change} from last month
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '24px',
                    color: stat.color
                  }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1.5rem'
          }}>
            {/* Left Column - Recent Visits */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#065f46',
                    margin: '0 0 0.25rem 0'
                  }}>
                    📍 Recent Site Visits
                  </h2>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#64748b',
                    margin: 0
                  }}>
                    Upcoming and recent customer visits
                  </p>
                </div>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  color: '#065f46',
                  border: '1px solid #065f46',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { customer: 'Rajesh Kumar', address: '123 MG Road, Delhi', status: 'pending', type: 'House Renovation' },
                  { customer: 'Priya Sharma', address: '456 Sector 15, Noida', status: 'scheduled', type: 'Electrical Work' },
                  { customer: 'Amit Patel', address: '789 East Street, Ghaziabad', status: 'completed', type: 'Plumbing' }
                ].map((visit, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: visit.status === 'completed' ? '#10b981' : 
                                       visit.status === 'scheduled' ? '#3b82f6' : '#f59e0b'
                      }}></div>
                      <div>
                        <h3 style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#1e293b',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {visit.customer}
                        </h3>
                        <p style={{ 
                          fontSize: '14px', 
                          color: '#64748b',
                          margin: '0 0 0.25rem 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          📍 {visit.address}
                        </p>
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#64748b',
                          margin: 0
                        }}>
                          {visit.type}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: visit.status === 'completed' ? '#dcfce7' : 
                                       visit.status === 'scheduled' ? '#dbeafe' : '#fef3c7',
                        color: visit.status === 'completed' ? '#166534' : 
                              visit.status === 'scheduled' ? '#1e40af' : '#92400e'
                      }}>
                        {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Team & Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Team Members */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: '#065f46',
                  margin: '0 0 1rem 0'
                }}>
                  👥 My Team
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { name: 'Ramesh Gupta', role: 'Electrician', rating: 4.8, projects: 42 },
                    { name: 'Suresh Yadav', role: 'Plumber', rating: 4.6, projects: 38 },
                    { name: 'Mahesh Singh', role: 'Carpenter', rating: 4.9, projects: 56 }
                  ].map((member, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        👤
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#1e293b',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {member.name}
                        </h4>
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#64748b',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {member.role}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '12px' }}>⭐ {member.rating}</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{member.projects} projects</span>
                        </div>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        fontWeight: '600'
                      }}>
                        Active
                      </span>
                    </div>
                  ))}
                  
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    color: '#065f46',
                    border: '1px solid #065f46',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    View All Team Members
                  </button>
                </div>
              </div>

              {/* Business Highlights */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: '#065f46',
                  margin: '0 0 1rem 0'
                }}>
                  🏆 Business Highlights
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#f59e0b',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      🏆
                    </div>
                    <div>
                      <p style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1e293b',
                        margin: '0 0 0.25rem 0'
                      }}>
                        Top Performer
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#64748b',
                        margin: 0
                      }}>
                        This month
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      📈
                    </div>
                    <div>
                      <p style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1e293b',
                        margin: '0 0 0.25rem 0'
                      }}>
                        Consistent Growth
                      </p>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#64748b',
                        margin: 0
                      }}>
                        12 months running
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ paddingTop: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '0.5rem' 
                    }}>
                      <span style={{ fontSize: '14px', color: '#64748b' }}>Project Completion</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#065f46' }}>94%</span>
                    </div>
                    <div style={{
                      height: '8px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: '94%',
                        backgroundColor: '#10b981',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#065f46',
              margin: '0 0 1rem 0'
            }}>
              ⚡ Quick Actions
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {[
                { title: 'Schedule Site Visit', subtitle: 'Plan customer assessments', icon: '📍' },
                { title: 'Manage Team', subtitle: 'Add/remove workers', icon: '👥' },
                { title: 'View Earnings', subtitle: 'Track commissions', icon: '💰' },
                { title: 'Business Analytics', subtitle: 'Performance insights', icon: '📊' }
              ].map((action, index) => (
                <button
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem 1rem',
                    backgroundColor: index === 0 ? '#10b981' : 'white',
                    color: index === 0 ? 'white' : '#065f46',
                    border: index === 0 ? 'none' : '1px solid #065f46',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (index !== 0) {
                      e.currentTarget.style.backgroundColor = '#f0fdf4';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (index !== 0) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <span style={{ fontSize: '24px', marginBottom: '0.5rem' }}>{action.icon}</span>
                  <span style={{ fontSize: '16px', marginBottom: '0.25rem' }}>{action.title}</span>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '400',
                    opacity: index === 0 ? '0.9' : '0.7'
                  }}>
                    {action.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandaloneThekedarDashboard;
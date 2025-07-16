import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

export default function App() {
  // 从localStorage加载数据，如果没有则使用默认值
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('quadrant-tasks');
      return savedTasks ? JSON.parse(savedTasks) : {
        q1: [],
        q2: [],
        q3: [],
        q4: []
      };
    } catch {
      return {
        q1: [],
        q2: [],
        q3: [],
        q4: []
      };
    }
  });

  // 从localStorage加载标题，如果没有则使用默认值
  const [quadrantLabels, setQuadrantLabels] = useState(() => {
    try {
      const savedLabels = localStorage.getItem('quadrant-labels');
      return savedLabels ? JSON.parse(savedLabels) : {
        q1: '重要且紧急',
        q2: '重要不紧急', 
        q3: '不重要但紧急',
        q4: '不重要不紧急'
      };
    } catch {
      return {
        q1: '重要且紧急',
        q2: '重要不紧急', 
        q3: '不重要但紧急',
        q4: '不重要不紧急'
      };
    }
  });
  
  const [newTask, setNewTask] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: ''
  });

  const [editingLabel, setEditingLabel] = useState(null);
  const [tempLabel, setTempLabel] = useState('');

  // 每当tasks变化时保存到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quadrant-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.log('无法保存数据到本地存储');
    }
  }, [tasks]);

  // 每当标题变化时保存到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quadrant-labels', JSON.stringify(quadrantLabels));
    } catch (error) {
      console.log('无法保存标题到本地存储');
    }
  }, [quadrantLabels]);

  const addTask = (quadrant) => {
    if (newTask[quadrant].trim()) {
      setTasks(prev => ({
        ...prev,
        [quadrant]: [...prev[quadrant], newTask[quadrant].trim()]
      }));
      setNewTask(prev => ({
        ...prev,
        [quadrant]: ''
      }));
    }
  };

  const removeTask = (quadrant, index) => {
    setTasks(prev => ({
      ...prev,
      [quadrant]: prev[quadrant].filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e, quadrant) => {
    if (e.key === 'Enter') {
      addTask(quadrant);
    }
  };

  const startEditingLabel = (quadrant) => {
    setEditingLabel(quadrant);
    setTempLabel(quadrantLabels[quadrant]);
  };

  const saveLabel = (quadrant) => {
    if (tempLabel.trim()) {
      setQuadrantLabels(prev => ({
        ...prev,
        [quadrant]: tempLabel.trim()
      }));
    }
    setEditingLabel(null);
    setTempLabel('');
  };

  const cancelEditingLabel = () => {
    setEditingLabel(null);
    setTempLabel('');
  };

  const handleLabelKeyPress = (e, quadrant) => {
    if (e.key === 'Enter') {
      saveLabel(quadrant);
    } else if (e.key === 'Escape') {
      cancelEditingLabel();
    }
  };

  const resetLabelsToDefault = () => {
    if (window.confirm('确定要重置所有标题为默认值吗？')) {
      setQuadrantLabels({
        q1: '重要且紧急',
        q2: '重要不紧急', 
        q3: '不重要但紧急',
        q4: '不重要不紧急'
      });
    }
  };

  const maxTasks = Math.max(...Object.values(tasks).map(taskList => taskList.length));
  const minHeight = Math.max(400, maxTasks * 60 + 150);

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      color: '#1f2937'
    },
    gridContainer: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '3px',
      border: '4px solid #374151',
      borderRadius: '12px',
      overflow: 'hidden',
      minHeight: `${minHeight}px`,
      backgroundColor: '#374151'
    },
    quadrant: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '250px'
    },
    q1: {
      backgroundColor: '#fef2f2'
    },
    q2: {
      backgroundColor: '#fffbeb'
    },
    q3: {
      backgroundColor: '#eff6ff'
    },
    q4: {
      backgroundColor: '#f0fdf4'
    },
    quadrantTitle: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '16px',
      textAlign: 'center',
      paddingBottom: '8px',
      borderBottom: '2px solid',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s'
    },
    editingInput: {
      fontSize: '16px',
      fontWeight: '700',
      textAlign: 'center',
      padding: '4px 8px',
      border: '2px solid',
      borderRadius: '4px',
      backgroundColor: 'white',
      width: '100%',
      marginBottom: '8px'
    },
    editButtons: {
      display: 'flex',
      gap: '4px',
      justifyContent: 'center',
      marginBottom: '8px'
    },
    editBtn: {
      padding: '4px 8px',
      fontSize: '12px',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    taskList: {
      flex: 1,
      marginBottom: '16px',
      minHeight: '120px'
    },
    taskItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: '12px',
      marginBottom: '8px',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontSize: '14px',
      color: '#374151',
      border: '1px solid #e5e7eb'
    },
    inputContainer: {
      display: 'flex',
      gap: '8px',
      marginTop: 'auto'
    },
    input: {
      flex: 1,
      padding: '10px 12px',
      border: '2px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: {
      padding: '10px 12px',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    removeBtn: {
      backgroundColor: 'transparent',
      color: '#ef4444',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      transition: 'all 0.2s'
    },
    footer: {
      marginTop: '30px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
      maxWidth: '1200px',
      margin: '30px auto 0'
    },
    clearBtn: {
      marginTop: '20px',
      padding: '8px 16px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      marginRight: '8px'
    },
    resetBtn: {
      marginTop: '20px',
      padding: '8px 16px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  const getQuadrantColors = (quadrant) => {
    const colors = {
      q1: {
        button: '#dc2626',
        buttonHover: '#b91c1c',
        title: '#b91c1c',
        inputFocus: '#dc2626'
      },
      q2: {
        button: '#d97706',
        buttonHover: '#b45309',
        title: '#b45309',
        inputFocus: '#d97706'
      },
      q3: {
        button: '#2563eb',
        buttonHover: '#1d4ed8',
        title: '#1d4ed8',
        inputFocus: '#2563eb'
      },
      q4: {
        button: '#059669',
        buttonHover: '#047857',
        title: '#047857',
        inputFocus: '#059669'
      }
    };
    return colors[quadrant];
  };

  const clearAllTasks = () => {
    if (window.confirm('确定要清空所有任务吗？')) {
      setTasks({
        q1: [],
        q2: [],
        q3: [],
        q4: []
      });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>四象限任务管理器</h1>
      
      <div style={styles.gridContainer}>
        <div style={styles.grid}>
          {Object.keys(tasks).map(quadrant => {
            const colors = getQuadrantColors(quadrant);
            return (
              <div key={quadrant} style={{...styles.quadrant, ...styles[quadrant]}}>
                {editingLabel === quadrant ? (
                  // 编辑模式
                  <div>
                    <input
                      type="text"
                      value={tempLabel}
                      onChange={(e) => setTempLabel(e.target.value)}
                      onKeyPress={(e) => handleLabelKeyPress(e, quadrant)}
                      onBlur={() => saveLabel(quadrant)}
                      style={{
                        ...styles.editingInput,
                        borderColor: colors.title,
                        color: colors.title
                      }}
                      autoFocus
                      placeholder="输入标题..."
                    />
                    <div style={styles.editButtons}>
                      <button
                        onClick={() => saveLabel(quadrant)}
                        style={{
                          ...styles.editBtn,
                          backgroundColor: colors.button,
                          color: 'white'
                        }}
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEditingLabel}
                        style={{
                          ...styles.editBtn,
                          backgroundColor: '#6b7280',
                          color: 'white'
                        }}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  // 显示模式
                  <h2 
                    style={{
                      ...styles.quadrantTitle, 
                      color: colors.title,
                      borderBottomColor: colors.title
                    }}
                    onClick={() => startEditingLabel(quadrant)}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="点击编辑标题"
                  >
                    {quadrantLabels[quadrant]}
                    <span style={{fontSize: '14px', fontWeight: 'normal', marginLeft: '8px'}}>
                      ({tasks[quadrant].length})
                    </span>
                  </h2>
                )}
                
                <div style={styles.taskList}>
                  {tasks[quadrant].map((task, index) => (
                    <div key={index} style={styles.taskItem}>
                      <span>{task}</span>
                      <button
                        onClick={() => removeTask(quadrant, index)}
                        style={styles.removeBtn}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {tasks[quadrant].length === 0 && (
                    <div style={{
                      color: '#9ca3af',
                      fontSize: '14px',
                      textAlign: 'center',
                      padding: '20px',
                      fontStyle: 'italic'
                    }}>
                      暂无任务
                    </div>
                  )}
                </div>
                
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    value={newTask[quadrant]}
                    onChange={(e) => setNewTask(prev => ({ ...prev, [quadrant]: e.target.value }))}
                    onKeyPress={(e) => handleKeyPress(e, quadrant)}
                    placeholder="添加任务..."
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = colors.inputFocus}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    onClick={() => addTask(quadrant)}
                    style={{...styles.button, backgroundColor: colors.button}}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.buttonHover}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.button}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div style={styles.footer}>
          <p style={{marginBottom: '8px'}}>按照艾森豪威尔矩阵管理你的任务：按重要性和紧急性分类</p>
          <p style={{marginBottom: '16px'}}>点击 + 按钮或按 Enter 键添加任务，点击 × 删除任务</p>
          <p style={{fontSize: '12px', color: '#9ca3af'}}>
            数据自动保存到浏览器本地存储
          </p>
          <button 
            onClick={clearAllTasks}
            style={styles.clearBtn}
          >
            清空所有任务
          </button>
        </div>
      </div>
    </div>
  );
}
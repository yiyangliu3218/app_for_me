import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// 环形可拖拽滑块组件
function CircularSlider({ percent, size = 48, stroke = 6, color = '#f87171', bg = '#e5e7eb', onDoubleClick, daysPassed, daysTotal }) {
  const radius = (size - stroke) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  // percent: 0~1
  return (
    <svg
      width={size}
      height={size}
      style={{ cursor: 'pointer', userSelect: 'none', display: 'block' }}
      onDoubleClick={onDoubleClick}
    >
      {/* 背景圆环 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={bg}
        strokeWidth={stroke}
        fill="none"
      />
      {/* 进度圆环，从北（0点）开始 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent)}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 0.2s' }}
      />
      {/* 中间文字：已过/总天数 */}
      <text
        x={center}
        y={center - 2}
        textAnchor="middle"
        fontSize={size / 3.5}
        fill={color}
        fontWeight="bold"
        pointerEvents="none"
      >
        {daysPassed}/{daysTotal}
      </text>
      <text
        x={center}
        y={center + size / 5}
        textAnchor="middle"
        fontSize={size / 5}
        fill="#888"
        pointerEvents="none"
      >
        天
      </text>
    </svg>
  );
}

// DDL 设置弹窗组件
function DDLModal({ open, onClose, onSave, defaultDays, defaultDate }) {
  const [mode, setMode] = React.useState(defaultDate ? 'date' : 'days'); // 'days' or 'date'
  const [days, setDays] = React.useState(defaultDays || 1);
  const [date, setDate] = React.useState(defaultDate || '');

  const handleSave = () => {
    if (mode === 'days') {
      onSave({ days: Number(days) });
    } else {
      onSave({ date });
    }
    onClose();
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 style={{marginTop:0,marginBottom:16}}>设置DDL</h3>
        <div style={{marginBottom:12}}>
          <label style={{marginRight:8}}>
            <input type="radio" checked={mode === 'days'} onChange={() => setMode('days')} />
            距离DDL的天数
          </label>
          <input
            type="number"
            min={1}
            value={days}
            onChange={e => setDays(e.target.value)}
            disabled={mode !== 'days'}
            style={{width:60,marginLeft:8}}
          />
        </div>
        <div style={{marginBottom:20}}>
          <label style={{marginRight:8}}>
            <input type="radio" checked={mode === 'date'} onChange={() => setMode('date')} />
            选择截止日期
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            disabled={mode !== 'date'}
            style={{marginLeft:8}}
          />
        </div>
        <button onClick={handleSave} style={{marginRight:8,background:'#f87171',color:'#fff',border:'none',borderRadius:4,padding:'6px 18px',fontWeight:600}}>确定</button>
        <button onClick={onClose} style={{background:'#e5e7eb',color:'#374151',border:'none',borderRadius:4,padding:'6px 18px'}}>取消</button>
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content {
          background: #fff; border-radius: 10px; padding: 28px 32px; min-width: 320px; box-shadow: 0 4px 24px #0002;
        }
        .modal-content h3 { margin-top: 0; }
        .modal-content > div { margin-bottom: 12px; }
        .modal-content button { margin-right: 8px; }
      `}</style>
    </div>
  );
}

// 计时浮窗组件
function FocusTimerModal({ open, onClose, task, onStart, onPause, onStop, running, elapsed }) {
  if (!open) return null;
  // 格式化秒为 mm:ss
  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 style={{marginTop:0,marginBottom:16}}>专注计时：{task.text}</h3>
        <div style={{fontSize:32, fontWeight:700, marginBottom:16}}>{fmt(elapsed)}</div>
        <div style={{marginBottom:16, color:'#888'}}>累计用时：{fmt((task.timeRecords||[]).reduce((sum, r) => sum + (r.end && r.start ? Math.floor((r.end - r.start)/1000) : 0), 0) + (running ? elapsed : 0))}</div>
        <div>
          {running ? (
            <>
              <button onClick={onPause} style={{marginRight:8,background:'#fbbf24',color:'#fff',border:'none',borderRadius:4,padding:'6px 18px',fontWeight:600}}>暂停</button>
              <button onClick={onStop} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:4,padding:'6px 18px',fontWeight:600}}>结束</button>
            </>
          ) : (
            <button onClick={onStart} style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:4,padding:'6px 18px',fontWeight:600}}>开始</button>
          )}
          <button onClick={onClose} style={{marginLeft:8,background:'#e5e7eb',color:'#374151',border:'none',borderRadius:4,padding:'6px 18px'}}>关闭</button>
        </div>
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content {
          background: #fff; border-radius: 10px; padding: 28px 32px; min-width: 320px; box-shadow: 0 4px 24px #0002;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  // 从localStorage加载数据，如果没有则使用默认值
  // 任务结构增加 ddlDate 字段
  const [ddlModal, setDDLModal] = useState({ open: false, quadrant: '', index: -1 });
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('quadrant-tasks');
      const parsed = savedTasks ? JSON.parse(savedTasks) : {
        q1: [],
        q2: [],
        q3: [],
        q4: []
      };
      const upgrade = (arr) => arr.map(t => {
        if (typeof t === 'string') return { text: t, progress: 0, minutesLeft: 0, daysToDDL: 1, createdAt: Date.now(), ddlDate: '', timeRecords: [] };
        if (typeof t === 'object' && t !== null) return {
          ...t,
          minutesLeft: t.minutesLeft ?? 0,
          daysToDDL: t.daysToDDL ?? 1,
          createdAt: t.createdAt ?? Date.now(),
          ddlDate: t.ddlDate ?? '',
          timeRecords: t.timeRecords ?? []
        };
        return t;
      });
      return {
        q1: upgrade(parsed.q1 || []),
        q2: upgrade(parsed.q2 || []),
        q3: upgrade(parsed.q3 || []),
        q4: upgrade(parsed.q4 || [])
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

  // 任务结构增加 timeRecords
  const [focusTimer, setFocusTimer] = useState({ open: false, quadrant: '', index: -1 });
  const [timerState, setTimerState] = useState({ running: false, start: null, elapsed: 0 });
  const timerRef = React.useRef();

  // 统计界面切换
  const [showStats, setShowStats] = useState(false);

  // 每当tasks变化时保存到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quadrant-tasks', JSON.stringify(tasks));
    } catch {
      console.log('无法保存数据到本地存储');
    }
  }, [tasks]);

  // 每当标题变化时保存到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quadrant-labels', JSON.stringify(quadrantLabels));
    } catch {
      console.log('无法保存标题到本地存储');
    }
  }, [quadrantLabels]);

  const addTask = (quadrant) => {
    if (newTask[quadrant].trim()) {
      setTasks(prev => ({
        ...prev,
        [quadrant]: [...prev[quadrant], { text: newTask[quadrant].trim(), progress: 0, minutesLeft: 0, daysToDDL: 1, createdAt: Date.now(), timeRecords: [] }]
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

  // 新增：处理进度条变更
  const handleProgressChange = (quadrant, index, newProgress) => {
    setTasks(prev => ({
      ...prev,
      [quadrant]: prev[quadrant].map((task, i) =>
        i === index ? { ...task, progress: newProgress } : task
      )
    }));
  };

  // 打开DDL弹窗
  const openDDLModal = (quadrant, index) => {
    setDDLModal({ open: true, quadrant, index });
  };
  // 保存DDL
  const saveDDL = ({ days, date }) => {
    setTasks(prev => {
      const { quadrant, index } = ddlModal;
      return {
        ...prev,
        [quadrant]: prev[quadrant].map((task, i) => {
          if (i !== index) return task;
          if (date) {
            return { ...task, ddlDate: date, daysToDDL: undefined, createdAt: task.createdAt || Date.now() };
          } else {
            return { ...task, daysToDDL: days, ddlDate: '', createdAt: task.createdAt || Date.now() };
          }
        })
      };
    });
  };

  // 计时相关逻辑
  const openFocusTimer = (quadrant, index) => {
    setFocusTimer({ open: true, quadrant, index });
    const task = tasks[quadrant][index];
    // 若有未结束的计时，恢复
    const last = (task.timeRecords||[]).slice(-1)[0];
    if (last && !last.end) {
      setTimerState({ running: true, start: last.start, elapsed: Math.floor((Date.now() - last.start)/1000) });
    } else {
      setTimerState({ running: false, start: null, elapsed: 0 });
    }
  };
  // 开始计时
  const startTimer = () => {
    setTimerState({ running: true, start: Date.now(), elapsed: 0 });
    timerRef.current = setInterval(() => {
      setTimerState(s => ({ ...s, elapsed: Math.floor((Date.now() - s.start)/1000) }));
    }, 1000);
    // 记录开始
    setTasks(prev => {
      const { quadrant, index } = focusTimer;
      return {
        ...prev,
        [quadrant]: prev[quadrant].map((task, i) =>
          i === index ? { ...task, timeRecords: [...(task.timeRecords||[]), { start: Date.now() }] } : task
        )
      };
    });
  };
  // 暂停计时
  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setTimerState(s => ({ ...s, running: false }));
    // 记录结束
    setTasks(prev => {
      const { quadrant, index } = focusTimer;
      return {
        ...prev,
        [quadrant]: prev[quadrant].map((task, i) => {
          if (i !== index) return task;
          const recs = [...(task.timeRecords||[])];
          if (recs.length && !recs[recs.length-1].end) recs[recs.length-1].end = Date.now();
          return { ...task, timeRecords: recs };
        })
      };
    });
  };
  // 结束计时
  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimerState({ running: false, start: null, elapsed: 0 });
    // 记录结束
    setTasks(prev => {
      const { quadrant, index } = focusTimer;
      return {
        ...prev,
        [quadrant]: prev[quadrant].map((task, i) => {
          if (i !== index) return task;
          const recs = [...(task.timeRecords||[])];
          if (recs.length && !recs[recs.length-1].end) recs[recs.length-1].end = Date.now();
          return { ...task, timeRecords: recs };
        })
      };
    });
    setFocusTimer({ open: false, quadrant: '', index: -1 });
  };
  // 关闭浮窗
  const closeTimer = () => {
    clearInterval(timerRef.current);
    setFocusTimer({ open: false, quadrant: '', index: -1 });
    setTimerState({ running: false, start: null, elapsed: 0 });
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

  if (showStats) {
    // 统计数据处理
    // 1. 所有任务累计用时
    const allTasks = Object.entries(tasks).flatMap(([q, arr]) => arr.map(t => ({...t, quadrant: q})));
    const totalTimes = allTasks.map(t => (t.timeRecords||[]).reduce((sum, r) => sum + (r.end && r.start ? Math.floor((r.end - r.start)/1000) : 0), 0));
    // 2. 本周/每天用时
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const dayLabels = Array.from({length: 7}, (_,i) => {
      const d = new Date(weekStart.getTime() + i*24*60*60*1000);
      return `${d.getMonth()+1}/${d.getDate()}`;
    });
    // 饼图数据
    const pieData = allTasks.map((t, i) => ({ name: t.text, value: totalTimes[i] }));
    const COLORS = ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#38bdf8', '#facc15'];
    // 堆叠柱状图数据
    const weekData = dayLabels.map((label, i) => {
      const obj = { day: label };
      allTasks.forEach((t) => {
        obj[t.text] = 0;
        (t.timeRecords||[]).forEach(r => {
          if (r.start && r.end) {
            const d = new Date(r.start);
            const idxDay = Math.floor((d - weekStart)/(24*60*60*1000));
            if (idxDay === i) obj[t.text] += Math.floor((r.end - r.start)/1000);
          }
        });
      });
      return obj;
    });
    return (
      <div style={{padding:32,maxWidth:900,margin:'0 auto'}}>
        <h2 style={{fontSize:28,fontWeight:700,marginBottom:24}}>任务用时统计</h2>
        <button onClick={()=>setShowStats(false)} style={{marginBottom:24,background:'#f87171',color:'#fff',border:'none',borderRadius:4,padding:'6px 18px',fontWeight:600}}>返回</button>
        <div style={{display:'flex',gap:32,flexWrap:'wrap',justifyContent:'center'}}>
          {/* 饼图 */}
          <div style={{width:340, height:340, background:'#fff', borderRadius:12, boxShadow:'0 2px 12px #0001', padding:16}}>
            <h4 style={{textAlign:'center',marginBottom:8}}>各任务累计用时占比</h4>
            <ResponsiveContainer width='100%' height={260}>
              <PieChart>
                <Pie data={pieData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* 堆叠柱状图 */}
          <div style={{flex:1, minWidth:340, background:'#fff', borderRadius:12, boxShadow:'0 2px 12px #0001', padding:16}}>
            <h4 style={{textAlign:'center',marginBottom:8}}>本周每日各任务用时</h4>
            <ResponsiveContainer width='100%' height={260}>
              <RBarChart data={weekData}>
                <XAxis dataKey='day' />
                <YAxis />
                <Tooltip />
                <Legend />
                {allTasks.map((t, idx) => (
                  <Bar key={t.text} dataKey={t.text} stackId='a' fill={COLORS[idx % COLORS.length]} />
                ))}
              </RBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>四象限任务管理器</h1>
      <button onClick={()=>setShowStats(true)} style={{position:'absolute',right:32,top:32,background:'#60a5fa',color:'#fff',border:'none',borderRadius:4,padding:'8px 22px',fontWeight:600,fontSize:16}}>统计</button>
      
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
                      <div style={{flex: 1}}>
                        <span onDoubleClick={() => openFocusTimer(quadrant, index)} style={{cursor:'pointer'}} title="双击开始计时">{task.text}</span>
                        {/* 进度条 */}
                        <div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 8}}>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={task.progress || 0}
                            onChange={e => handleProgressChange(quadrant, index, Number(e.target.value))}
                            style={{flex: 1}}
                          />
                          <span style={{minWidth: 32, fontSize: 12, color: '#888'}}>{task.progress || 0}%</span>
                        </div>
                      </div>
                      {/* 右侧圆形剩余时间环，自动显示已过/总天数比例，双击可自定义DDL天数或日期 */}
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 16}}>
                        {(() => {
                          const created = task.createdAt || Date.now();
                          const now = Date.now();
                          let daysPassed = 1, daysTotal = 1, percent = 1;
                          if (task.ddlDate) {
                            // 用日期
                            const ddl = new Date(task.ddlDate + 'T23:59:59').getTime();
                            daysPassed = Math.max(1, Math.ceil((now - created) / (24*60*60*1000)));
                            daysTotal = Math.max(1, Math.ceil((ddl - created) / (24*60*60*1000)));
                            percent = Math.min(1, daysPassed / daysTotal);
                          } else {
                            // 用天数
                            daysPassed = Math.max(1, Math.ceil((now - created) / (24*60*60*1000)));
                            daysTotal = task.daysToDDL || 1;
                            percent = Math.min(1, daysPassed / daysTotal);
                          }
                          return (
                            <>
                              <CircularSlider
                                percent={percent}
                                size={48}
                                stroke={6}
                                color="#f87171"
                                bg="#e5e7eb"
                                onDoubleClick={() => openDDLModal(quadrant, index)}
                                daysPassed={daysPassed}
                                daysTotal={daysTotal}
                              />
                              <DDLModal
                                open={ddlModal.open && ddlModal.quadrant === quadrant && ddlModal.index === index}
                                onClose={() => setDDLModal({ open: false, quadrant: '', index: -1 })}
                                onSave={saveDDL}
                                defaultDays={task.daysToDDL}
                                defaultDate={task.ddlDate}
                              />
                              {/* 计时浮窗 */}
                              <FocusTimerModal
                                open={focusTimer.open && focusTimer.quadrant === quadrant && focusTimer.index === index}
                                onClose={closeTimer}
                                task={task}
                                onStart={startTimer}
                                onPause={pauseTimer}
                                onStop={stopTimer}
                                running={timerState.running}
                                elapsed={timerState.elapsed}
                              />
                            </>
                          );
                        })()}
                      </div>
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
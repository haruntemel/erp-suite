import { useEffect, useRef } from 'react';

const Lobby = () => {
  const retryBtnRef = useRef<HTMLButtonElement>(null);
  const refreshBtnRef = useRef<HTMLButtonElement>(null);
  const metricValueRef = useRef<HTMLDivElement>(null);
  const secondMetricValueRef = useRef<HTMLDivElement>(null);

  const handleTestConnection = () => {
    const btn = retryBtnRef.current;
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
      btn.disabled = true;

      setTimeout(() => {
        const success = Math.random() > 0.3;

        if (success) {
          btn.innerHTML = '<i class="fas fa-check"></i> Connected!';
          btn.style.background = 'linear-gradient(135deg, #10b981 0%, #047857 100%)';
        } else {
          btn.innerHTML = '<i class="fas fa-times"></i> Failed';
          btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
        }

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 2000);
      }, 1500);
    }
  };

  const handleRefreshData = () => {
    const btn = refreshBtnRef.current;
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
      btn.disabled = true;

      setTimeout(() => {
        // Update metrics
        if (metricValueRef.current) {
          metricValueRef.current.textContent = `${Math.floor(Math.random() * 1000) + 3500} kt`;
        }

        // Update time
        const now = new Date();
        const timeStr = now.getHours() + 'k' + now.getMinutes();
        if (secondMetricValueRef.current) {
          secondMetricValueRef.current.textContent = timeStr;
        }

        btn.innerHTML = '<i class="fas fa-check"></i> Data Updated';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #047857 100%)';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 1500);
      }, 1200);
    }
  };

  useEffect(() => {
    const retryBtn = retryBtnRef.current;
    const refreshBtn = refreshBtnRef.current;

    if (retryBtn) retryBtn.addEventListener('click', handleTestConnection);
    if (refreshBtn) refreshBtn.addEventListener('click', handleRefreshData);

    return () => {
      if (retryBtn) retryBtn.removeEventListener('click', handleTestConnection);
      if (refreshBtn) refreshBtn.removeEventListener('click', handleRefreshData);
    };
  }, []);

  return (
    <div className="lobby-content">
      <div className="dashboard-grid">
        {/* Backend Connection Test Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-server"></i>
            </div>
            <h2 className="card-title">Backend Connection Test</h2>
          </div>

          <div className="status-message">
            <strong>DMCX 2020.</strong> Connection established connected to expanding memory.
          </div>

          <div className="status-message">
            Any client (both hosts, mobile arrays) per of remotely masks.
          </div>

          <button className="btn btn-retry" ref={retryBtnRef}>
            <i className="fas fa-sync-alt"></i>
            Test Connection
          </button>
        </div>

        {/* Data Base Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-database"></i>
            </div>
            <h2 className="card-title">Data Base</h2>
          </div>

          <div className="list-item">
            <div className="list-icon memory">
              <i className="fas fa-memory"></i>
            </div>
            <div>
              <div>Memory</div>
              <div className="metric-label">Version: 2.0x</div>
            </div>
          </div>

          <div className="list-item">
            <div className="list-icon flow">
              <i className="fas fa-stream"></i>
            </div>
            <div>
              <div>Flow Checker</div>
              <div className="metric-label">List: available spot</div>
            </div>
          </div>
        </div>

        {/* Axe Monitor Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-desktop"></i>
            </div>
            <h2 className="card-title">Axe Monitor</h2>
          </div>

          <div className="list-item">
            <div className="list-icon intel">
              <i className="fab fa-intel"></i>
            </div>
            <div>
              <div>Intel Core i5G(R)</div>
              <div className="metric-label">Active X 3.0 (TS)</div>
            </div>
          </div>

          <div className="list-item">
            <div className="list-icon memory">
              <i className="fas fa-hdd"></i>
            </div>
            <div>
              <div>Disk Status</div>
              <div className="metric-label">Memory: Version: 2.0x</div>
            </div>
          </div>

          <div className="list-item">
            <div className="list-icon flow">
              <i className="fas fa-filter"></i>
            </div>
            <div>
              <div>Flow Checker</div>
              <div className="metric-label">List: available spot</div>
            </div>
          </div>
        </div>

        {/* Axe Allofolder Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h2 className="card-title">Axe Allofolder</h2>
          </div>

          <div className="list-item">
            <div>
              <div>Only reads</div>
              <div className="metric-value" ref={metricValueRef}>3987 kt</div>
              <div className="metric-label">Storage code(s)</div>
            </div>
          </div>

          <div className="list-item">
            <div>
              <div>Token identity</div>
              <div className="metric-value" ref={secondMetricValueRef}>21k42</div>
              <div className="metric-label">Last updated: 10k4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info Section */}
      <div className="debug-info">
        <div className="card-header">
          <div className="card-icon">
            <i className="fas fa-bug"></i>
          </div>
          <h2 className="card-title">Debug Info</h2>
        </div>

        <table className="debug-table">
          <tbody>
            <tr>
              <td className="debug-label">Name</td>
              <td><div className="debug-value">/ name</div></td>
            </tr>
            <tr>
              <td className="debug-label">User</td>
              <td><div className="debug-value">/ status</div></td>
            </tr>
            <tr>
              <td className="debug-label">Backend URL</td>
              <td><div className="debug-value url-value">http://localhost:1928</div></td>
            </tr>
          </tbody>
        </table>

        <button className="btn" ref={refreshBtnRef} style={{ marginTop: '20px' }}>
          <i className="fas fa-redo"></i>
          Refresh All Data
        </button>
      </div>
    </div>
  );
};

export default Lobby;
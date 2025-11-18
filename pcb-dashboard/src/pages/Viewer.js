import React, { useState } from 'react';
import {
  Tabs,
  Card,
  Select,
  Table,
  Alert,
  Tooltip as AntTooltip
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  AppstoreOutlined,
  BarChartOutlined,
  SearchOutlined,
  TableOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

import PCBCompoundViewer from '../PCBCompoundViewer';
import data from '../data/pcb_stats.json';

// --- page-level style system to match the rest of the app ---
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background:
      'linear-gradient(to bottom right, #f3e8ff, #ffffff 40%, #dbeafe 80%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: '4rem',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 10,
    position: 'relative',
    padding: '4rem 1.5rem 3rem 1.5rem'
  },
  headerBlock: {
    textAlign: 'left',
    marginBottom: '2rem',
    animation: 'fadeIn 0.8s ease-out'
  },
  titleRow: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    lineHeight: 1.2,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  titleAccent: {
    background: 'linear-gradient(to right,#7c3aed,#2563eb 60%)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    fontWeight: 800
  },
  subText: {
    marginTop: '0.75rem',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#4b5563',
    maxWidth: '800px'
  },
  headerDivider: {
    width: '4rem',
    height: '4px',
    background: 'linear-gradient(to right, #7c3aed, #2563eb)',
    borderRadius: '9999px',
    marginTop: '1.5rem',
    animation: 'pulse 2s ease-in-out infinite'
  },

  dashboardCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 20px 35px rgba(0,0,0,0.12)',
    border: '2px solid rgba(124,58,237,0.08)'
  },

  infoCard: {
    marginTop: '2rem',
    backgroundColor: '#fdfcff',
    borderRadius: '1rem',
    border: '2px solid rgba(124,58,237,0.12)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    padding: '1.25rem 1rem',
    color: '#1f2937'
  },

  infoTitleRow: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#111827',
    gap: '0.5rem'
  },
  infoBody: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#4b5563'
  },

  // wrap Select + chart so spacing is consistent
  sectionBlock: {
    marginBottom: '2rem'
  }
};

// animated blobs (soft background floaters)
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:.8; transform:scale(1.05); }
  }
  @keyframes floatSlow {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    25% { transform: translate(20px,-20px) rotate(4deg); }
    50% { transform: translate(-15px,-35px) rotate(-3deg); }
    75% { transform: translate(-20px,-10px) rotate(2deg); }
  }
`;

const FloatingBlob = ({ size, color, top, left, delay, blur = '40px' }) => {
  const blobStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '9999px',
    backgroundColor: color,
    opacity: 0.22,
    filter: `blur(${blur})`,
    top,
    left,
    animation: `floatSlow 10s ease-in-out infinite`,
    animationDelay: delay,
    pointerEvents: 'none'
  };
  return <div style={blobStyle} />;
};

const { TabPane } = Tabs;
const { Option } = Select;

function PCBExplorer() {
  const [selectedCongener, setSelectedCongener] = useState(
    Object.keys(data.perCongener)[0]
  );
  const [highlightTop3, setHighlightTop3] = useState(true);

  // Build chart data for Top 10
  // value is % contribution to total PCB load, already scaled to %
  const top10 = Object.entries(data.top10Congeners).map(
    ([name, value], idx) => ({
      name,
      value: parseFloat((value * 100).toFixed(2)),
      highlight: highlightTop3 && idx < 3
    })
  );

  // table rows for Summary Stats tab
  const summaryTable = Object.entries(data.summaryStats).map(
    ([name, stats]) => ({ key: name, name, ...stats })
  );

  // "Explore Congener" tab – all samples for one chosen congener
  const explorerData =
    data.perCongener[selectedCongener]?.map((v, i) => ({
      index: i + 1,
      value: v
    })) || [];

  const columns = [
    { title: 'Congener', dataIndex: 'name', key: 'name' },
    { title: 'Mean', dataIndex: 'mean', key: 'mean' },
    { title: 'Std Dev', dataIndex: 'std', key: 'std' },
    { title: 'Min', dataIndex: 'min', key: 'min' },
    { title: 'Max', dataIndex: 'max', key: 'max' }
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* inject shared animations */}
      <style>{keyframes}</style>

      {/* softly glowing background elements */}
      <FloatingBlob
        size="220px"
        color="#e9d5ff"
        top="8%"
        left="5%"
        delay="0s"
      />
      <FloatingBlob
        size="260px"
        color="#bfdbfe"
        top="45%"
        left="80%"
        delay="2s"
      />
      <FloatingBlob
        size="300px"
        color="#fbcfe8"
        top="75%"
        left="15%"
        delay="4s"
      />

      <div style={styles.contentWrapper}>
        {/* Page header */}
        <div style={styles.headerBlock}>
          <div style={styles.titleRow}>
            <span>PCB Compound</span>
            <span style={styles.titleAccent}>Explorer</span>
          </div>
          <div style={styles.subText}>
            Visualize PCB congeners found in maternal samples. See which ones
            dominate total load, explore each congener’s sample distribution,
            and review summary statistics. This is the “what’s actually in the
            blood” page.
          </div>
          <div style={styles.headerDivider} />
        </div>

        {/* Main dashboard card that holds Tabs and content */}
        <div style={styles.dashboardCard}>
          <Tabs
            defaultActiveKey="viewer"
            tabBarGutter={24}
            tabBarStyle={{
              fontWeight: 600
            }}
            items={[
              {
                key: 'viewer',
                label: (
                  <span>
                    <AppstoreOutlined /> 3D Compound Viewer
                  </span>
                ),
                children: (
                  <div style={styles.sectionBlock}>
                    <PCBCompoundViewer />
                  </div>
                )
              },
              {
                key: 'top',
                label: (
                  <span>
                    <BarChartOutlined /> Top 10 Congeners
                  </span>
                ),
                children: (
                  <div style={styles.sectionBlock}>
                    <div
                      style={{
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        color: '#1f2937'
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={highlightTop3}
                          onChange={() => setHighlightTop3(!highlightTop3)}
                          style={{ marginRight: 4 }}
                        />
                        <span>
                          Highlight Top 3 Contributors{' '}
                          <AntTooltip
                            title="These congeners make up most of the PCB burden across all samples."
                            color="#7c3aed"
                          >
                            <InfoCircleOutlined
                              style={{ color: '#7c3aed' }}
                            />
                          </AntTooltip>
                        </span>
                      </label>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: 400
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={top10}
                          layout="vertical"
                          margin={{
                            top: 10,
                            right: 30,
                            left: 100,
                            bottom: 50
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            domain={[0, 'auto']}
                            unit="%"
                            label={{
                              value: 'Contribution (%)',
                              position: 'insideBottom',
                              offset: -10,
                              dy: 10
                            }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            label={{
                              value: 'Congener Name',
                              angle: -90,
                              position: 'outsideLeft',
                              dx: -50
                            }}
                          />
                          <Tooltip
                            formatter={(value) => `${value}%`}
                            cursor={{ fill: 'rgba(124,58,237,0.08)' }}
                          />
                          <Bar
                            dataKey="value"
                            // default color is overridden by logic below
                            isAnimationActive={true}
                            label={{ position: 'right' }}
                            shape={(props) => {
                              // custom bar shape to highlight top 3
                              const { fill, x, y, width, height, payload } =
                                props;
                              const barFill = payload.highlight
                                ? '#7c3aed'
                                : '#8884d8';
                              return (
                                <rect
                                  x={x}
                                  y={y}
                                  width={width}
                                  height={height}
                                  rx={4}
                                  ry={4}
                                  fill={barFill}
                                  stroke={
                                    payload.highlight
                                      ? 'rgba(124,58,237,0.4)'
                                      : 'none'
                                  }
                                  strokeWidth={payload.highlight ? 2 : 0}
                                />
                              );
                            }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )
              },
              {
                key: 'explore',
                label: (
                  <span>
                    <SearchOutlined /> Explore Congener
                  </span>
                ),
                children: (
                  <div style={styles.sectionBlock}>
                    <div
                      style={{
                        marginBottom: 20,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#1f2937'
                        }}
                      >
                        Select a Congener:
                      </div>
                      <Select
                        style={{ minWidth: 260 }}
                        value={selectedCongener}
                        onChange={setSelectedCongener}
                        showSearch
                        optionFilterProp="children"
                        popupMatchSelectWidth={260}
                      >
                        {Object.keys(data.perCongener).map((cong) => (
                          <Select.Option key={cong} value={cong}>
                            {cong}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>

                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={explorerData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 80,
                            bottom: 50
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="index"
                            label={{
                              value: 'Sample Index',
                              position: 'insideBottom',
                              offset: -5,
                              dy: 10
                            }}
                          />
                          <YAxis
                            label={{
                              value: 'Congener Level (ng/L)',
                              angle: -90,
                              position: 'outsideLeft',
                              dx: -40
                            }}
                          />
                          <Tooltip
                            cursor={{ fill: 'rgba(124,58,237,0.08)' }}
                          />
                          <Bar
                            dataKey="value"
                            fill="#8884d8"
                            isAnimationActive={true}
                            radius={[4, 4, 4, 4]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )
              },
              {
                key: 'summary',
                label: (
                  <span>
                    <TableOutlined /> Summary Stats
                  </span>
                ),
                children: (
                  <div style={styles.sectionBlock}>
                    <Table
                      columns={columns}
                      dataSource={summaryTable}
                      pagination={{ pageSize: 10 }}
                      scroll={{ x: true }}
                      style={{
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(124,58,237,0.12)'
                      }}
                    />
                  </div>
                )
              }
            ]}
          />
        </div>

        {/* "How we calculated this" card */}
        <div style={styles.infoCard}>
          <div style={styles.infoTitleRow}>
            <InfoCircleOutlined style={{ color: '#7c3aed' }} />
            <span>How We Calculated These Results</span>
          </div>
          <div style={styles.infoBody}>
            <p style={{ marginBottom: '0.75rem' }}>
              For each sample, we summed the values of all PCB congeners to get
              that sample&apos;s total PCB exposure. Then we computed each
              congener&apos;s contribution by dividing its value by that total.
            </p>
            <p
              style={{
                backgroundColor: '#f3e8ff',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontFamily:
                  'Menlo, Consolas, ui-monospace, SFMono-Regular, monospace',
                fontSize: '0.8rem',
                color: '#4b5563',
                marginBottom: '0.75rem'
              }}
            >
              contribution = congener_value / total_exposure
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              The “Top 10 Congeners” chart shows which specific PCB species
              dominate overall body burden on average.
            </p>
            <p style={{ marginBottom: 0 }}>
              The “Summary Stats” tab shows spread information (mean, standard
              deviation, min, max) for each congener — basically how common and
              how variable each one is across all samples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PCBExplorer;

import React, { useState, useEffect } from 'react';

// 假设 Gandi 插件全局对象为 gandi
export default function TileMapPlugin(gandi) {
  
  // 1. 定义编辑器组件
  const MapEditor = () => {
    const [grid, setGrid] = useState(new Array(100).fill(0));
    const width = 10;

    // 点击格子切换类型 (0 -> 1 -> 2 -> 0)
    const toggleTile = (index) => {
      const newGrid = [...grid];
      newGrid[index] = (newGrid[index] + 1) % 3;
      setGrid(newGrid);
    };

    // 保存到 Gandi 文件系统
    const saveToFile = async () => {
      const content = JSON.stringify({
        width: 10,
        height: 10,
        data: grid
      });
      // 调用 Gandi API 写入文件
      await gandi.fs.writeFile('tile-map.json', content);
      alert('地图已保存到 tile-map.json');
    };

    return (
      <div style={{ padding: 10, background: '#222', color: '#fff' }}>
        <h3>瓦片地图编辑器 (10x10)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${width}, 25px)`,
          gap: 2 
        }}>
          {grid.map((tile, i) => (
            <div 
              key={i}
              onClick={() => toggleTile(i)}
              style={{
                width: 25, height: 25,
                backgroundColor: tile === 0 ? '#444' : (tile === 1 ? '#4CAF50' : '#FF5722'),
                border: '1px solid #000'
              }}
            />
          ))}
        </div>
        <button onClick={saveToFile} style={{ marginTop: 10 }}>保存地图</button>
      </div>
    );
  };

  // 2. 注入 UI 到 Gandi
  // 监听选中的角色是否为 tile-map
  gandi.on('target-changed', (targetName) => {
    if (targetName === 'tile-map') {
      // 在 Gandi 的右侧面板或浮窗展示 MapEditor
      gandi.gui.showWindow('tile-map-editor', {
        title: 'Tile Map Editor',
        content: <MapEditor />
      });
    }
  });
}
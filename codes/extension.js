const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

class TileMapExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.mapData = [0]; // 初始地图数据
        this.width = 10;
        this.camX = 0;
        this.camY = 0;
    }

    getInfo() {
        return {
            id: 'simpleTileMap',
            name: '基础瓦片地图',
            blocks: [
                {
                    opcode: 'refreshMap',
                    blockType: BlockType.COMMAND,
                    text: '刷新地图数据'
                },
                {
                    opcode: 'render',
                    blockType: BlockType.COMMAND,
                    text: '渲染当前视口'
                }
            ]
        };
    }

    // 从 Gandi 文件系统读取 tile-map.json
    async refreshMap() {
        try {
            // Gandi 环境下可以直接 fetch 项目内的文件
            const response = await fetch('tile-map.json');
            const json = await response.json();
            this.mapData = json.data;
            this.width = json.width;
            console.log('地图已同步:', this.mapData);
        } catch (e) {
            console.error('没找到 tile-map.json，请先在插件中保存');
        }
    }

    render() {
        const target = this.runtime.getSpriteTargetByName('tile-map');
        if (!target) return;

        const pen = this.runtime.getPeripheralExtension('pen');
        if (pen) pen.clear(); // 清屏

        const tileSize = 32;
        for (let i = 0; i < this.mapData.length; i++) {
            const tileId = this.mapData[i];
            if (tileId === 0) continue; // 0 是空白

            const col = i % this.width;
            const row = Math.floor(i / this.width);

            // 简单的坐标转换
            const x = (col * tileSize) - 200; 
            const y = 150 - (row * tileSize);

            target.setXY(x, y);
            target.setCostume(tileId - 1); // 造型索引
            if (pen) pen.stamp();
        }
    }
}

module.exports = TileMapExtension;
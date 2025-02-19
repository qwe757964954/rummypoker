import { _decorator, Component, Material, Sprite, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GlowEffectController')
export class GlowEffectController extends Component {
    private _material: Material | null = null;
    private _time: number = 0;

    onLoad() {
        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            this._material = sprite.getMaterialInstance(0);
        }
    }

    update(deltaTime: number) {
        if (!this._material) return;
    
        // 更新时间
        this._time += deltaTime;
    
        // 计算透明度，范围 100 到 255
        let alpha = 100 + Math.abs(Math.sin(this._time * 2)) * (255 - 100); 
    
        // // 更新发光颜色 (rgba)
        let glowColor = new Vec4(255 / 255, 255 / 255, 0 / 255, alpha / 255); // 转为 [0, 1] 范围
    
        // // 将 glowColor 应用到材质
        this._material.setProperty('glowColor', glowColor);
        // this._material.setProperty('glowColorSize', alpha / 255 / 10);
    }
    
}

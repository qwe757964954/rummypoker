import { _decorator, Color, Component, Node, Sprite, Tween, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GlowEffect')
export class GlowEffect extends Component {
    @property({ type: Node, tooltip: "需要发光的节点" })
    targetNode: Node | null = null;

    @property({ tooltip: "发光的颜色" })
    glowColor: Color = new Color(255, 255, 0, 255); // 默认黄色发光

    @property({ tooltip: "发光强度变化时间 (秒)" })
    glowDuration: number = 1.0;

    private originalColor: Color | null = null; // 保存节点的原始颜色
    private glowTween: Tween<UIOpacity> | null = null;

    onLoad() {
        if (!this.targetNode) {
            console.warn("未指定需要发光的节点！");
            return;
        }

        const sprite = this.targetNode.getComponent(Sprite);
        if (!sprite) {
            console.error("目标节点需要有 Sprite 组件才能应用发光效果！");
            return;
        }

        // 保存原始颜色
        this.originalColor = sprite.color;
        // this.startGlow(); // 开始发光
    }

    startGlow() {
        if (!this.targetNode) return;

        const sprite = this.targetNode.getComponent(Sprite);
        if (!sprite) return;
        let kuangOpacity = this.targetNode.getComponent(UIOpacity);
        // 动态调整颜色透明度，模拟发光效果
        this.glowTween = tween(kuangOpacity)
            .repeatForever(
                tween()
                    .call(() => {
                        sprite.color = this.glowColor; // 设置发光颜色
                    })
                    .to(this.glowDuration, { opacity: 255 }) // 发光渐强
                    .to(this.glowDuration, { opacity: 0 }) // 发光渐弱
            )
            .start();
    }

    stopGlow() {
        if (this.glowTween) {
            this.glowTween.stop();
            this.glowTween = null;
        }

        // 恢复原始颜色
        if (this.targetNode && this.originalColor) {
            const sprite = this.targetNode.getComponent(Sprite);
            if (sprite) sprite.color = this.originalColor;
        }
    }

    onDestroy() {
        this.stopGlow(); // 确保在销毁时停止动画
    }
}

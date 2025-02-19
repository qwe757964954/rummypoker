import { _decorator, Component, easing, Graphics, Node, tween, Vec3 } from 'cc';
import { RummyPoker } from './RummyPoker';
const { ccclass, property } = _decorator;

@ccclass('Rocket')
export class Rocket extends Component {
    @property(Node)
    rocketNode: Node = null!;  // 火箭的节点

    @property(Graphics)
    graphics: Graphics = null!;  // 用于绘制轨迹的 Graphics 组件

    @property(Node)
    public number: Node = null; //

    private time: number = 0;  // 用于控制时间和曲线的进度
    private curveControlPoints: Vec3[] = [];  // 曲线的控制点
    private lastPosition: Vec3 = new Vec3(0, 0, 0);  // 记录上一帧的位置
    private _stopped: boolean = true;
    private _stopY: number = 285

    // 设置最大角度（45度）
    private maxAngle: number = 40;

    start() {
        // 初始化曲线控制点
        this.curveControlPoints.push(new Vec3(0, 0, 0));         // 起点
        this.curveControlPoints.push(new Vec3(205, 5, 0));     // 控制点1，x增长更快，y逐步增大
        this.curveControlPoints.push(new Vec3(455, 65, 0));     // 控制点2，继续调整y
        this.curveControlPoints.push(new Vec3(730, 290, 0));    // 终点，x继续增长，y限制在750
        // 初始化 Graphics
        this.graphics.clear();  // 清空之前的绘制
        this.graphics.moveTo(this.curveControlPoints[0].x, this.curveControlPoints[0].y);  // 移动到起点
        this.lastPosition = this.curveControlPoints[0];  // 初始化上一位置

        tween(this.number)
            .to(0, { position: new Vec3(this.number.position.x, this.number.position.y + 80) }, { easing: easing.sineIn })
            .start();
        let cards2 = [0x25, 0x26, 0x27, 0x28, 0x29,
            0x11, 0x13, 0x14, 0x17,
            0x36, 0x2B, 0x0B, 0x3B,
            0x22];

        let cards3 = [0x27, 0x28, 0x29,
            0x11, 0x3B, 0x13, 0x14,
            0x25, 0x26, 0x0B,
            0x34, 0x2B, 0x36,
            0x17
        ]

        let cards4 = [0x04, 0x05, 0x06,
            0x15, 0x3A, 0x17,
            0x1C,
            0x05, 0x0B,
            0x22, 0x2C,
            0x34, 0x36
        ]

        let cards5 = [0x17, 0x18, 0x19,
            0x1C, 0x2C, 0x3A,
            0x04, 0x05, 0x06,
            0x05, 0x0B,
            0x15,
            0x34, 0x36
        ]

        let cards6 = [0x17, 0x18, 0x19, 0x1A,
            0x1C, 0x2C, 0x0C,
            0x04, 0x05, 0x06,
            0x0B,
            0x38, 0x36, 0x3A
        ]
        let cards7 = [0x03, 0x04, 0x05,
            0x11, 0x12, 0x42,
            0x1A, 0x2A, 0x26,
            0x04, 0x0B,
            0x38, 0x3D
        ]
        let cards8 = [0x07, 0x08, 0x09, 0x0A,
            0x18, 0x19, 0x1A,
            0x12, 0x13, 0x14,
            0x28, 0x42, 0x06
        ]
        let cards9 = [0x3C, 0x3D, 0x31,
            0x0B, 0x06, 0x0D, ,
            0x2B, 0x3B, 0x26,
            0x05, 0x1A, 0x34, 0x39
        ]
        let cards10 = [0x3C, 0x3D, 0x31,
            0x0D, 0x06, 0x01, ,
            0x2B, 0x3B, 0x0B,
            0x26, 0x34, 0x35,
            0x39, 0x1A
        ]
        let cards11 = [0x03, 0x04, 0x05,
            0x1A, 0x1B, 0x1D, 0x42,
            0x2B, 0x3B, 0x0B,
            0x22, 0x42, 0x24,
            0x02, 0x12, 0x32
        ]
        let cards12 = [0x31, 0x32, 0x33,
            0x2C, 0x21, 0x35,
            0x0B, 0x0C, 0x42,
            0x25, 0x08,
            0x26, 0x27, 0x38
        ]
        let cards13 = [0x19, 0x1A, 0x1B, 0x1C,
            0x21, 0x22, 0x05,
            0x1D, 0x2D, 0x25,
            0x06, 0x16, 0x26
        ]
        let cards14 = [0x19, 0x1A, 0x1B,
            0x0A, 0x2A, 0x3A,
            0x41, 0x27, 0x29,
            0x41, 0x06, 0x36,
            0x2A, 0x16,
        ]
        let cards15 = [0x02, 0x0B, 0x0D, 0x09, 0x01,
            0x12, 0x15, 0x16, 0x18, 0x11,
            0x22, 0x22, 0x23, 0x29, 0x2B,
            0x32
        ]
        let cards16 = [0x0B, 0x0C, 0x0D, 0x09, 0x01,
            0x11, 0x13, 0x19,
            0x21, 0x23, 0x29,
            0x3C, 0x42
        ]
        let cards17 = [0x01, 0x02, 0x03,
            0x06, 0x07, 0x08, 0x09,
            0x1B, 0x1C, 0x42, 0x19,
            0x15, 0x16, 0x41,
        ]
        let cards18 = [0x07, 0x08, 0x09,
            0x37, 0x38, 0x31, 0x41, 0x42,
            0x1B, 0x1D, 0x42,
            0x18, 0x19, 0x04,
        ]
        let cards19 = [12, 13, 20, 28, 34, 52, 56, 59, 60, 61, 65, 65, 66];
        let cards20 = [0x23, 0x24, 0x25, 0x26, 0x27,
            0x0B, 0x0D, 0x41,
            0x09, 0x19, 0x39,
            0x25, 0x15, 0x41,
        ]
        let cards21 = [0x12, 0x13, 0x14,
            0x12, 0x14, 0x15, 0x41,
            0x36, 0x38, 0x42,
            0x29, 0x2B,
            0x19, 0x3C
        ]
        let cards22 = [41, 42, 43, 44,
            33, 34, 35,
            1, 7, 11, 66,
            45, 61, 65]
        let cards23 = [0x1C, 0x1D, 0x11,
            0x28, 0x29, 0x2A,
            0x02, 0x03, 0x04,
            0x01, 0x0A, 0x0C, 0x17, 0x41]
        let cards24 = [0x2B, 0x2C, 0x2D,
            0x0D, 0x27, 0x41, 0x41,
            0x05, 0x15, 0x25,
            0x04, 0x34, 0x42, 0x16]

        let cards25 = [0x04, 0x08, 0x0A,
            0x0B, 0x0C, 0x18,
            0x1B, 0x1B, 0x36,
            0x3A, 0x3B, 0x22, 0x2B, 0x42]

        let cards26 = [0x34, 0x35, 0x36,
            0x38, 0x3C, 0x19,
            0x1A, 0x1C, 0x04,
            0x09, 0x0A, 0x42, 0x41, 0x25]
        let bestGroups = RummyPoker.getInstance().rummyGroup(cards26);
        
        console.log("bestGroups", bestGroups);
        // let remainingCards = [7,7,8];
        // let result = RummyPoker.getInstance().addInvalidGroups([], remainingCards);

        // console.log("result", result);
        // console.log("result", result2);
        // console.log("result2", result3);
    }

    update(deltaTime: number) {
        if (this._stopped) {
            return;
        }

        this.time += deltaTime * 0.3;  // 控制移动的速度

        // 计算当前时间下的曲线位置，使用贝塞尔曲线
        let t = this.time % 1;  // 确保 t 在 [0, 1] 范围内

        // 使用三次贝塞尔曲线公式
        let p0 = this.curveControlPoints[0];
        let p1 = this.curveControlPoints[1];
        let p2 = this.curveControlPoints[2];
        let p3 = this.curveControlPoints[3];

        // 计算贝塞尔曲线的点
        let x = this.calculateBezier(t, p0.x, p1.x, p2.x, p3.x);
        let y = this.calculateBezier(t, p0.y, p1.y, p2.y, p3.y);

        // 更新火箭的位置
        this.rocketNode.setPosition(x, y, 0);

        // 计算当前角度
        let angle = this.calculateAngleWithArc(t);
        this.rocketNode.setRotationFromEuler(0, 0, angle);  // 设置火箭旋转

        // 绘制轨迹
        this.graphics.lineTo(x, y);  // 连接当前点和之前的点
        this.graphics.stroke();  // 完成绘制
        let stopY =
            console.log("yyyyyyyyyyyy", y, this.curveControlPoints[3].y - 5)
        // 如果火箭到达终点，可以根据需求重置或做其他处理
        if (y >= this._stopY) {
            this._stopped = true;  // 标记火箭已到达终点
        }
    }

    // 贝塞尔曲线计算方法
    private calculateBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
        // 三次贝塞尔曲线公式
        let mt = 1 - t;
        return Math.pow(mt, 3) * p0 + 3 * Math.pow(mt, 2) * t * p1 + 3 * mt * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
    }

    // 计算从贝塞尔曲线上的点获得火箭角度
    private calculateAngleWithArc(t: number): number {
        // 根据 t 值计算角度，从 0° 到 45°
        let angle = t * this.maxAngle; // 根据 t 线性增加角度
        return angle;
    }

    // 计算两个位置之间的角度
    private calculateAngle(from: Vec3, to: Vec3): number {
        // 使用 Math.atan2 计算角度（返回的是弧度）
        let deltaX = to.x - from.x;
        let deltaY = to.y - from.y;
        let angle = Math.atan2(deltaY, deltaX);  // 计算从 "from" 到 "to" 的角度
        return angle * (180 / Math.PI);  // 将弧度转换为度数
    }
}

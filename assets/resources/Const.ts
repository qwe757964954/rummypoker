import { color } from "cc";
import { GroupType } from "./RummyPoker";

export class RummyConst {
    public static MY_VIEW: number = 0;                  //自己的viewid
    public static GAME_PLAYER: number = 4;              //玩家人数
    public static MAX_COUNT: number = 14;               //最大数目
    public static MAX_WEAVE: number = 6;                //最大组合
    public static MAX_REPERTORY: number = 108;          //最大牌数 两副牌
    public static HISTORY_LEN: number = 54;             //出牌记录长度
    public static LEN_NICKNAME: number = 32;            //用户名字
    

	// public static CARD_S_KING = 66  //0x42; 					//王牌小
	// public static CARD_B_KING = 65  //0x41; 					//王牌大
    
	public static CARD_S_KING = 0x42; 					//王牌小
	public static CARD_B_KING = 0x41; 					//王牌大


    public static SOUND_PATH: string = "Res/Sound/";
}

export enum GAME_STATUS {
    GAME_STATUS_FREE = 0,
    GAME_STATUS_MID = 50,
    GAME_STATUS_PLAY = 100
}

export enum PLAYER_STATUS{
    US_NULL = 0x00,     //没有状态
    US_FREE = 0x01,     //站立状态
    US_SIT = 0x02,      //坐下状态
    US_READY = 0x03,    //同意状态
    US_LOOKON = 0x04,   //旁观状态
    US_PLAYING = 0x05,  //游戏状态
    US_OFFLINE = 0x06,  //断线状态
}

//当前游戏状态[0无意义,1等待摸牌,2等待出牌,3等待Show牌人组牌,4荒庄等待玩家组牌,5胡牌等待其余玩家组牌]
export enum PLAY_STATUS {
    INVALID = 0,
    GET,
    OUT,
    CONFIRM,
    HUAGN_ZHUANG_CONFIRM,
    WAIT_OTHER_CONFIRM
}
export enum Phrase {
    'hello everyone!',
    'hahahahahaha!',
    'This game is great!',
    'certainly I will win !',
    'Can i make friends with you',
    'Nice to meet you !',
    'hold my beer ',
    'Awesome!',
    'Can you beat me this round?',
    'Today is your day',
    'You\'re the man',
    'Sorry,I have to leave now'   
}

/** 
 * @description 互动表情
 * @param name  string 动画名称
 * @param type  number 动画类型 0单个动画，2end动画
 * @param delay bnunber 延时时间
 */
export const InteractEmote = [
    {name:"gongjian",   type:2, delay:1.8 },
    {name:"bingtong",   type:0 },
    {name:"daocha",     type:0 },
    {name:"dapao",      type:2, delay:2 },
    {name:"jidan",      type:0 },
    {name:"xianbing",   type:0 },
    {name:"jiguanqiang",type:2, delay:1 },
    {name:"zhuaji",     type:0 },
    {name:"meigui",     type:0 },
    {name:"ganbei",     type:0 },
    {name:"woshou",     type:0 },
]

export const GroupConfig = {
    /** Group type descriptions */
    TypeText: {
        [GroupType.TYPE_NULL]: 'Void',
        [GroupType.TYPE_SINGLE]: 'Void', // Can be customized
        [GroupType.TYPE_PURE_SEQUENCE]: 'Impure',
        [GroupType.TYPE_SEQUENCE]: 'Impure',
        [GroupType.TYPE_PURE_SET]: 'Set',
        [GroupType.TYPE_SET]: 'Set',
        [GroupType.TYPE_SINGLE_LZ]: 'Joker',
        [GroupType.TYPE_FIRST_LIFE]: '1st Life',
        [GroupType.TYPE_SECOND_LIFE]: '2nd life',
        [GroupType.TYPE_FIRST_LIFE_NEED]: '1st life needed',
        [GroupType.TYPE_SECOND_LIFE_NEED]: '2nd Life needed',
    },

    /** Visual configurations for group items */
    Visuals: {
        Colors: {
            Green: color(34, 103, 85),
            Yellow: color(194, 110, 27),
            Red: color(170, 51, 51),
        },
        Images: {
            Green: 'box_G1',
            Yellow: 'box_Y1',
            Red: 'box_R1',
        },
    },

    /** Mapping of group types to their visual configurations */
    TypeVisualMapping: {
        [GroupType.TYPE_NULL]: { Pic: 'box_R1', Color: color(170, 51, 51) },  // Red
        [GroupType.TYPE_SINGLE]: { Pic: 'box_R1', Color: color(170, 51, 51) }, // Red
        [GroupType.TYPE_PURE_SEQUENCE]: { Pic: 'box_G1', Color: color(34, 103, 85) }, // Green
        [GroupType.TYPE_SEQUENCE]: { Pic: 'box_G1', Color: color(34, 103, 85) },     // Green
        [GroupType.TYPE_PURE_SET]: { Pic: 'box_B1', Color: color(71,248,251) },    // blue
        [GroupType.TYPE_SET]: { Pic: 'box_B1', Color: color(71,248,251) },         // blue
        [GroupType.TYPE_SINGLE_LZ]: { Pic: 'box_G1', Color: color(34, 103, 85) },    // Green
        [GroupType.TYPE_FIRST_LIFE]: { Pic: 'box_G1', Color: color(34, 103, 85) },   // Green
        [GroupType.TYPE_SECOND_LIFE]: { Pic: 'box_G1', Color: color(34, 103, 85) },  // Green
        [GroupType.TYPE_FIRST_LIFE_NEED]: { Pic: 'box_Y1', Color: color(188,140,37) },   // yellow
        [GroupType.TYPE_SECOND_LIFE_NEED]: { Pic: 'box_Y1', Color: color(188,140,37) },  // yellow
    },
};
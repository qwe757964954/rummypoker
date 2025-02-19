


// public dwUserList:Array<Number> = [];
export class CMD_Base {
    public initData() {
        //初始化数据(数组需初始化)
    }

    public read(byte: any): any {
        
    }

    public toByteArray(offset: number = 0): any {
        
    }
}

import { RummyConst } from "./Const";

export class CMD_GAME {
    public static MDM_GF_GAME: number = 221;//游戏主命令
    /***************************客户端发起协议****************************** */
    public static SUB_C_GET_CARD: number = 1;                               //摸牌命令 自己摸第一张牌后 马上把 drop上的钱变成
    public static SUB_C_OUT_CARD: number = 2;                               //出牌
    public static SUB_C_TRUSTEE: number = 3;                                //用户托管 是否需要托管消息
    public static SUB_C_HU: number = 4;                                     //如果是诈胡的话 会提示客户端再组合一次牌 失败就当做放弃80倍底分  --先把牌放到中间胡就直接胡 诈胡就等待组
    public static SUB_C_FRESH_GROUPCARD: number = 5;                        //Show牌后确认组牌用
    public static SUB_C_DROP: number = 7;                                   //投降 轮到自己出牌的时候不让点drop的按钮 强退那就没办法
    public static SUB_C_LAST_DEAL: number = 8;                              //请求上局战绩
    public static SUB_C_OPEN_DECK: number = 9;                              //请求出牌区的牌 按花色分
    public static SUB_C_HU_TEST: number = 16;                               //直接胡-测试功能
    public static SUB_C_Arena_ContinuePlay: number = 17;                    //续玩
    public static SUB_C_FRESH_GROUPCARD_RealTime: number = 18;              //手动组牌（随时都可以）
	public static SUB_C_SEND_CHAT_MESSAGE: number = 19;						//聊天
	public static SUB_C_CARD_RECORDER_DATA: number = 20;					//记牌器

    /***************************服务端返回协议****************************** */
    public static SUB_S_GAME_START: number = 100;                   //游戏开始
    public static SUB_S_SEND_CARD: number = 101;                    //摸牌
    public static SUB_S_OUT_CARD: number = 102;                     //用户出牌  将牌放到出牌区 只做校验 客户端是先出再发消息
    public static SUB_S_HU: number = 103;                           //诈胡 先会把牌放到showhere 之后 组牌失败会把牌移到出牌区
    public static SUB_S_FRESH_GROUPCARD: number = 104;              //组牌 只发给自己
    public static SUB_S_ZHAHU: number = 105;                        //诈胡
    public static SUB_S_NO_CARD: number = 106;                      //荒庄了 提醒所有玩家组牌 不需要发送额外的消息
    public static SUB_S_GAME_END: number = 107;                     //游戏结束
    public static SUB_S_DROP: number = 108;                         //玩家投降
    public static SUB_S_StartCountDown: number = 118;               //开局倒计时 触发
    public static SUB_S_TRUSTEE: number = 119;                      //用户托管
    public static SUB_S_ReRandList: number = 120;                   //无限洗牌
    public static SUB_S_Arena_ContinuePlay: number = 121;           //重置竞技场门票
	public static SUB_S_SEND_CHAT_MESSAGE: number = 122;			//聊天
	public static SUB_S_CARD_RECORDER_DATA: number = 123;			//记牌器
}

/////////////////////////////////////////////////服务端发送消息//////////////////////////////////////////////////////////
//组数据
export class tagWeaveItem extends CMD_Base {
	public cbWeaveKind: number = 0;							//组合类型[0无类型(invalid),1单牌,2纯同花顺 pure sequence,3同花顺(带癞子)sequence,4纯刻子set,5刻子]
	public dlCardData: number = RummyConst.MAX_COUNT;
	public cbCardData: Array<number> = [];					//麻将数据
	public cbCardCount: number = 0;							//组大小
	public cbPoint: number = 0;								//分数
}
//牌数据
export class tagRecord extends CMD_Base{
	public dlCardData: number = RummyConst.MAX_REPERTORY;
	public cbCardData: Array<number> = [];					//牌数据
}

export class DealUserInfo extends CMD_Base {
    public dwGameID: number = 0;                     //内容长度 4
    public dwUserID: number = 0;                     //用户id I D 4
    public wFaceID: number = 0;                      //头像id I D 2
    //用户属性
    public cbGender: number = 0;                      //用户性别 1
    public wTableID: number = 0;                 //桌子索引 2
    public wChairID: number = 0;                 //椅子索引 2
    public cbUserStatus: number = 0;                 //用户状态 1
	public lScore: number = 0;                 //输赢分数
	public dwPoint: number = 0;                 //输赢点数
	public szNickName: string = "";                 //输赢点数
}


//上局玩家信息
export class dealInfo extends CMD_Base {
	
	public cbPlayCount: number = 0;										//开始游戏时的人数  是几 记录就要显示几个人的
	public cbMagicValue: number = 0;									//癞子值

	public dlWeaveItemCount: number = RummyConst.GAME_PLAYER;
	public cbWeaveItemCount: Array<number> = [];						//组合数目   cbPlayStatus = 3的只显示牌背就行
	public dlWeaveItemArray: number = RummyConst.GAME_PLAYER * RummyConst.MAX_WEAVE;
	public WeaveItemArray: Array<tagWeaveItem> = [];
	public dlUserInfo: number = RummyConst.GAME_PLAYER;
	public lUserInfo: Array<DealUserInfo> = [];								//用户uid
	public initData(){
		for (let i = 0; i < this.dlWeaveItemArray; i++){
			this.WeaveItemArray.push(new tagWeaveItem());
		}
		
		for (let i = 0; i < this.dlUserInfo; i++){
			this.lUserInfo.push(new DealUserInfo());
		}
	}
}

//场景消息:空闲状态
export class CMD_S_StatusFree extends CMD_Base {
	//游戏属性
	public lCellScore: number = 0;									//基础积分
	//时间信息
	public cbTimeOutCard: number = 0;								//出牌时间
	public cbTimeGetCard: number = 0;								//摸牌时间
	public cbTimeGroupCard: number = 0;								//诈胡/胡牌/荒庄  组牌时间
	//封顶分数
	public cbMaxPoint: number = 0;									//正常是80  其实可以弄个不封顶的场
	//逃跑、投降分数
    dlDropPoint = 3;
	public cbDropPoint: Array<number> = [];							//20 40 80
	public dwStartCountDown: number = 0;							//触发开始时间

    //竞技场相关
	public lArena_HP: number = 0;
	public lArena_XP: number = 0;
	public dwArena_EXPTime: number = 0;								//过期时间
	public wArena_UsedFreeCount: number = 0;						//已使用免费次数
	public lArena_UserScore: number = 0;							//身上金币
	public cbPlayerCount: number = 0;								//人数
}

export class UserInfoHead extends CMD_Base {
    public dwGameID: number = 0;                     //内容长度 4
    public dwUserID: number = 0;                     //用户id I D 4
    public wFaceID: number = 0;                      //头像id I D 2
    //用户属性
    public cbGender: number = 0;                      //用户性别 1
	public cbMemberOrder:number = 0;            //会员等级

    public wTableID: number = 0;                 //桌子索引 2
    public wChairID: number = 0;                 //椅子索引 2
    public cbUserStatus: number = 0;                 //用户状态 1
	public lScore: number = 0;                 //输赢分数
	public szNickName: string = "";                 //帐号昵称 LEN_NICKNAME = 32
	public bTrustee: boolean = false;                 //是否托管
}


//场景消息:游戏场景
export class CMD_S_StatusPlay extends CMD_Base {
	//游戏属性
	public lCellScore: number = 0;									//基础积分
	//时间信息
	public cbTimeOutCard: number = 0;								//出牌时间
	public cbTimeGetCard: number = 0;								//摸牌时间
	public cbTimeGroupCard: number = 0;								//诈胡/胡牌/荒庄  组牌时间
    //竞技场相关
	public lArena_HP: number = 0;
	public lArena_XP: number = 0;
	public dwArena_EXPTime: number = 0;								//过期时间
	public wArena_UsedFreeCount: number = 0;						//已使用免费次数
	public lArena_UserScore: number = 0;							//身上金币
	//封顶分数
	public cbMaxPoint: number = 0;									//正常是80  其实可以弄个不封顶的场
	//逃跑、投降分数
    dlDropPoint = 3;
	public cbDropPoint: Array<number> = [];							//20 40 80
	public wBankerUser: number = 0;									//庄家用户 用处不大
	public wCurrentUser: number = 0;								//当前用户

	public cbGameStatus: number = 0;								//当前游戏状态[0无意义,1等待摸牌,2等待出牌,3等待诈胡组牌,4/荒庄等待玩家组牌,5胡牌等待其余玩家组牌]
	public cbMagicCard: number = 0;									//癞子牌颜色
	public cbMagicValue: number = 0;								//癞子值
	public cbLeftCardCount: number = 0;								//牌堆剩余牌数
	public cbOutCardData: number = 0;								//出牌区的牌
	public cbIsOutCardFirstCard: number = 0;						//出牌区的那张牌是否是系统出的牌（第一张）
	public cbShowHereCard: number = 0;								//show 区的牌
	public cbDeclareStatus: number = 0;								//荒庄 或胡牌情况下 是否已组牌(废弃)
	public cbLeftTime: number = 0;									//倒计时 出牌 摸牌 组牌

	public lDropScore: number = 0;									//当前drop的分数
	public lTableScore: number = 0;									//逃跑或诈胡的人 输的分 放桌子showhere上面
	public cbWeaveItemCount: number = 0;							//组合数目   cbPlayStatus = 3的只显示牌背就行
    dlWeaveItemArray = RummyConst.MAX_WEAVE;
	public WeaveItemArray: Array<tagWeaveItem> = [];								//组合扑克

	public cbOpenMode: number = 0;													//是否明牌 0 否 1 是
    dlWeaveItemCountALL = RummyConst.GAME_PLAYER;
	public cbWeaveItemCountALL: Array<number> = [];									//组合数目
    dltagWeaveItemArrayALL = RummyConst.GAME_PLAYER * RummyConst.MAX_WEAVE;
	public tagWeaveItemArrayALL: Array<tagWeaveItem> = [];							//组合扑克
	public dlOutCardRecords: number = RummyConst.HISTORY_LEN;
	public wOutCardRecords: Array<number> = [];										//出牌记录
	public cbPlayerCount: number = 0;								//人数
	public cbOutCardCount: number = 0;								//已经打出牌数

	public dlUserInfoHead: number = RummyConst.GAME_PLAYER;
	public lUserInfoHead: Array<UserInfoHead> = [];								//用户uid

	public initData(){
		for (let i = 0; i < this.dlWeaveItemArray; i++){
			this.WeaveItemArray.push(new tagWeaveItem());
		}
			
		for (let i = 0; i < this.dltagWeaveItemArrayALL; i++){
			this.tagWeaveItemArrayALL.push(new tagWeaveItem());
		}
			
		for (let i = 0; i < this.dlUserInfoHead; i++){
			this.lUserInfoHead.push(new UserInfoHead());
		}
	}
}

//开始倒计时
export class CMD_S_StartCountDown extends CMD_Base {
	public dwStartCountDownBegin: number = 0;									//触发开始时间
}

//游戏开始
//客户端发牌后先显示cbCardData
//然后按cbWeaveCount 显示成几个分开的组合
//客户端显示按数组下标 组合5 组合4 组合3 组合2 组合1 组合0  (每个组合中牌从左到右下标 0->最大)
//组合从右往左下标0 - >6，客户端group加组合加到最左边，等于6个组合时 右边两个组合合并
//cmd.SUB_S_GAME_START                 =100  --游戏开始
export class CMD_S_GameStart extends CMD_Base {
	public wBankerUser: number = 0;												//庄家位置
	public wCurrentUser: number = 0;											//当前玩家 从他开始摸牌打牌
	public cbFirstCard: number = 0;												//翻出来的第一张出牌区的牌 供庄家选择是否模
	public cbMagicCard: number = 0;												//翻出来的那张癞子牌放牌堆最底下 王默认是癞子 2副牌四个王 没有大小之分
	public cbMagicValue: number = 0;											//癞子的值 所有牌面是这个值的就是癞子 比如翻到王则A是癞子值为1
	public dlCardData: number = RummyConst.MAX_COUNT - 1;
	public cbCardData: Array<number> = [];
	public cbCardCount: number = 0;												//扑克数目
	public cbLeftCardCount: number = 0;											//剩余扑克数目
	public cbWeaveCount: number = 0;											//组合数目
	public dltagWeaveItemArray: number = RummyConst.MAX_WEAVE;
	public tagWeaveItemArray: Array<tagWeaveItem> = [];
	public dlPlayStatus: number = RummyConst.GAME_PLAYER;
	public cbPlayStatus: Array<number> = [];
	public cbIsOutCardFirstCard: number = 0;									//出牌区的那张牌是否是系统出的牌（第一张）

	public cbOpenMode: number = 0;												//是否明牌 0 否 1 是
	public dlWeaveItemCountALL: number = RummyConst.GAME_PLAYER;
	public cbWeaveItemCountALL: Array<number> = [];								//组合数目
	public dltagWeaveItemArrayALL: number = RummyConst.GAME_PLAYER * RummyConst.MAX_WEAVE;
	public tagWeaveItemArrayALL: Array<tagWeaveItem> = [];						//组合扑克

	public dlOutCardRecords: number = RummyConst.HISTORY_LEN;
	public wOutCardRecords: Array<number> = [];									//出牌记录

	public initData(): void {
		for (let i = 0; i < this.dltagWeaveItemArray; i++)
			this.tagWeaveItemArray.push(new tagWeaveItem());
		for (let i = 0; i < this.dltagWeaveItemArrayALL; i++)
			this.tagWeaveItemArrayALL.push(new tagWeaveItem());
	}
}

//摸牌
//cmd.SUB_S_SEND_CARD                      =101  --摸牌
export class CMD_S_SendCard extends CMD_Base {
	public wCurrentUser: number = 0;									//摸牌的人
	public cbSendType: number = 0;										//摸牌类型[0模牌堆的牌(摸牌人才能看见牌 其余人255),1模出牌区的牌] 都能看见牌
	public cbCardData: number = 0;										//用户摸的牌 或 牌堆发出的牌    --0xFF代表牌背
	public cbLastOutCardData: number = 0;								//出牌区最新的牌 255代表没牌显示空的
	public cbIsOutCardFirstCard: number = 0;							//无用
	
	public cbLeftCardCount: number = 0;									//牌堆剩余牌数
	public cbIsLastCard: number = 0;									//是否是摸牌区的最后一张牌

    //摸的牌已放到下标0的组合牌组的最后(客户端最右边)
	public cbWeaveCount: number = 0;									//组合数目
	public dltagWeaveItemArray: number = RummyConst.MAX_WEAVE;
	public tagWeaveItemArray: Array<tagWeaveItem> = [];
	
	public dlOutCardRecords: number = RummyConst.HISTORY_LEN;
	public wOutCardRecords: Array<number> = [];							//出牌记录
	public cbOutCardCount: number = 0;												//已经打出的牌数
	public initData(): void {
		for (let i = 0; i < this.dltagWeaveItemArray; i++)
			this.tagWeaveItemArray.push(new tagWeaveItem());
	}
}

//出牌
//cmd.SUB_S_OUT_CARD                       =102  --牌放到出牌区  将牌放到出牌区 只做校验 客户端是先出再发消息
export class CMD_S_OutCard extends CMD_Base {
	public wOutUser: number = 0;													//出牌的人
	public wCurrentUser: number = 0;												//下一位摸牌的人
	public cbCardData: number = 0;													//出的牌

	public cbWeaveCount: number = 0;												//组合数目
	public dltagWeaveItemArray: number = RummyConst.MAX_WEAVE;
	public tagWeaveItemArray: Array<tagWeaveItem> = [];
	
	public cbOpenMode: number = 0;													//是否明牌 0 否 1 是
	public dlOutCardRecords: number = RummyConst.HISTORY_LEN;
	public wOutCardRecords: Array<number> = [];										//出牌记录
	public cbOutCardCount: number = 0;												//已经打出的牌数
	public initData(): void {
		for (let i = 0; i < this.dltagWeaveItemArray; i++)
			this.tagWeaveItemArray.push(new tagWeaveItem());
	}
}

//玩家投降
// cmd.SUB_S_DROP                           =108  --玩家投降
export class CMD_S_Drop extends CMD_Base {
	public wChairID: number = 0;							//投降用户座位号
	public cbCardData: number = 0;							//诈胡的牌 将牌移到出牌区 不是0xFF 就要把这张牌移到出牌区

	public wCurrentUser: number = 0;						//下一位摸牌的人  --不是0xFFFF说明轮到这个人摸牌了 是的话肯定会收到结束游戏的消息
	public lLostScore: number = 0;							//投降分数
	public cbPoint: number = 0;								//投降输点数
}

//用户托管
// cmd.SUB_S_TRUSTEE                        =119  --用户托管
export class CMD_S_Trustee extends CMD_Base {
	public wChairID: number = 0;							//当前玩家 从他开始摸牌打牌
	public cbTrustee: number = 0;							//荒庄 或胡牌情况下 是否已组牌
}

//重新洗牌
export class CMD_S_ReRandList extends CMD_Base {
	public cbLastOutCardData: number = 0;
	public cbIsOutCardFirstCard: number = 0;
	public cbLeftCardCount: number = 0;								//牌堆剩余牌数
}

//胡
// 客户端点Show，发送SUB_C_HU--->收到此命令CMD_S_Hu（cbType == 1）--->客户端确定组牌，发送SUB_C_FRESH_GROUPCARD--->如果能胡，则收到此命令CMD_S_Hu（cbType == 2），如果不能胡则收到SUB_S_ZHAHU
// 注：cbType == 0 组牌成功的情况下点Show后直接赢（已废弃，改成了都需要确认组牌）
// cmd.SUB_S_HU                         =103  --Show 先会把牌放到showhere 之后 组牌失败会把牌移到出牌区
export class CMD_S_Hu extends CMD_Base {
	public cbType: number = 0;									//0 等待其余玩家组牌，1 等待胡玩家组牌 2 Show组牌成功胡牌 等待其余玩家组牌
	public wHuUser: number = 0;									//出牌的人
	public cbCardData: number = 0;								//出的牌

	public cbWeaveCount: number = 0;							//组合数目 只有胡牌人可见 最终诈胡则牌直接盖着？或者结束时摊开
	public dltagWeaveItemArray: number = RummyConst.MAX_WEAVE;
	public tagWeaveItemArray: Array<tagWeaveItem> = [];
	
	public dlOutCardRecords: number = RummyConst.HISTORY_LEN;
	public wOutCardRecords: Array<number> = [];					//出牌记录

	public initData(): void {
		for (let i = 0; i < this.dltagWeaveItemArray; i++)
			this.tagWeaveItemArray.push(new tagWeaveItem());
	}
}

//诈胡
//cmd.SUB_S_ZHAHU                          =105  --诈胡
export class CMD_S_ZhaHu extends CMD_Base {
	public wHuUser: number = 0;								//诈胡的人
	public cbCardData: number = 0;							//诈胡的牌 将牌移到出牌区
	public wCurrentUser: number = 0;						//下一位摸牌的人
	public lLostScore: number = 0;							//诈胡的人输的分数 80倍底分
}

// cmd.SUB_S_FRESH_GROUPCARD                =104  --组牌 只发给自己
export class CMD_S_FreshGroupCard extends CMD_Base {
	public wDeclareUser: number = 0;											//组牌玩家

	public cbWeaveCount: number = 0;											//组合数目
	public dltagWeaveItemArray: number = RummyConst.MAX_WEAVE;
	public tagWeaveItemArray: Array<tagWeaveItem> = [];
	
	public cbOver: number = 0;													//是否结束 0正常组牌 1胡牌结束 2荒庄结束
	public cbAllPoint: number = 0;												//牌组总分
	public lScore: number = 0;													//有人胡牌时输的分

	public initData(): void {
		for (let i = 0; i < this.dltagWeaveItemArray; i++)
			this.tagWeaveItemArray.push(new tagWeaveItem());
	}
}

//游戏结束
// cmd.SUB_S_GAME_END                       =107  --游戏结束
export class CMD_S_GameEnd extends CMD_Base {
	public lCellScore: number = 0;											//底分
	public cbIsHuang: number = 0;											//是否荒庄结束

	//竞技场相关
	public dlArena_HP: number = RummyConst.GAME_PLAYER;
	public lArena_HP: Array<number> = [];
	public dlArena_XP: number = RummyConst.GAME_PLAYER;
	public lArena_XP: Array<number> = [];
	public dlArena_EXPTime: number = RummyConst.GAME_PLAYER;
	public dwArena_EXPTime: Array<number> = [];
	public dlArena_Finished: number = RummyConst.GAME_PLAYER;
	public cbArena_Finished: Array<number> = [];							//是否大结算
	public dlArena_AwardValue: number = RummyConst.GAME_PLAYER;
	public lArena_AwardValue: Array<number> = [];							//本次奖励
	public dlArena_AwardType: number = RummyConst.GAME_PLAYER;
	public cbArena_AwardType: Array<number> = [];							//0 无奖励, 1 直接显示奖励 2 多项随机奖励

	public dlGameTax: number = RummyConst.GAME_PLAYER;
	public lGameTax: Array<number> = [];									//游戏税收
	public dlGameScore: number = RummyConst.GAME_PLAYER;
	public lGameScore: Array<number> = [];									//玩家输赢分 扣税后的  0说明是没玩的 只有一个赢家

	public dealInfo: dealInfo;												//通过这个结构体显示结果面板

	//客户端自用字段
	public cdRewardType: number = -1;
	public cdRewardValue1: number = -1;
	public cdRewardValue2: number = -1;
	public cdRewardValue3: number = -1;

	public initData(): void {
		this.dealInfo = new dealInfo();
		this.dealInfo.initData();
	}
}

//竞技场续玩
export class CMD_S_ArenaResetTickeFee extends CMD_Base {
	public wChairID: number = 0;
	public cbResultCode: number = 0;							//0 重置失败 1 重置成功

	public lArena_HP: number = 0;
	public lArena_XP: number = 0;
	public dwArena_EXPTime: number = 0;
	public wArena_UsedFreeCount: number = 0;
	public lArena_UserScore: number = 0;
}
	
	
			
			
//聊天
export class CMD_S_SendChatMessage extends CMD_Base{
	public cbType: number = 0;
	public wFromChairID: number = 0;
	public wToChairID: number = 0;
	public cbMessageID: number = 0;
}
//记牌器
export class CMD_S_CardRecorderData extends CMD_Base{
	public dlCardDataArray: number = RummyConst.GAME_PLAYER;
	public cbCardDataArray: Array<tagRecord> = [];
	public initData(): void {
		for (let i = 0; i < this.dlCardDataArray; i++){
			this.cbCardDataArray.push(new tagRecord());
		}
			
	}
	
}

/////////////////////////////////////////////////客户端发送消息//////////////////////////////////////////////////////////
//摸牌
// cmd.SUB_C_GET_CARD                       =1  --摸牌命令 自己摸第一张牌后 马上把 drop上的钱变成
export class CMD_C_GetCard extends CMD_Base {
	public cbGetType: number;															//摸牌类型[0模牌堆的牌,1模出牌区的牌]      --注意出牌区的癞子不准摸
	//以下是客户端组合出的牌 需要传到服务端 服务端需要校验 如果校验失败默认牌组合是原来的
	public dlWeaveCardData: number = RummyConst.MAX_WEAVE * RummyConst.MAX_COUNT;		//摸牌类型[0模牌堆的牌,1模出牌区的牌]      --注意出牌区的癞子不准摸
	public cbWeaveCardData: Array<number>;												//扑克组合数据 每个组合牌数目 0-14
	public cbWeaveCount: number;														//组合数目
}

//出牌
export class CMD_C_OutCard extends CMD_Base {
	public cbCardData: number;										//出的牌
	//以下是客户端组合出的牌 需要传到服务端 服务端需要校验 如果校验失败默认牌组合是原来的
	public dlWeaveCardData: number = RummyConst.MAX_WEAVE * RummyConst.MAX_COUNT;
	public cbWeaveCardData: Array<number>;
	public cbWeaveCount: number;
	 
}

//托管
// cmd.SUB_C_TRUSTEE                        =3  --用户托管 是否需要托管消息
export class CMD_C_Trustee extends CMD_Base {
	public bTrustee: boolean;							//是否托管
}

//胡  点了胡后  马上把drop上显示的钱变成 maxpoint*底分
// cmd.SUB_C_HU                         =4  --如果是诈胡的话 会提示客户端再组合一次牌 失败就当做放弃80倍底分  --先把牌放到中间胡就直接胡 诈胡就等待组
export class CMD_C_Hu extends CMD_Base {
	public cbCardData: number = 0;																//出的牌
	public dlWeaveCardData: number = RummyConst.MAX_WEAVE * RummyConst.MAX_COUNT;
	public cbWeaveCardData: Array<number> = [];
	public cbWeaveCount: number = 0;															//组合数目
}

export class CMD_CardData extends CMD_Base {
	public cbWeaveCardData: Array<number> = [];							//扑克组合数据 每个组合牌数目 0-14
	
}

//组牌
// cmd.SUB_C_FRESH_GROUPCARD                =5  --组牌 不管啥时候都可以组
export class CMD_C_FreshGroupCard extends CMD_Base {
	public dlWeaveCardData: number = RummyConst.MAX_WEAVE * RummyConst.MAX_COUNT;
	public cbWeaveCardData: Array<number> = [];							//扑克组合数据 每个组合牌数目 0-14
	public cbWeaveCount: number = 0;									//组合数目
}

export class CMD_C_ArenaResetTickeFee extends CMD_Base {
	public wChairID: number;
}
//聊天
export class CMD_C_SendChatMessage extends CMD_Base{
	public cbType: number;
	public wFromChairID: number;
	public wToChairID: number;
	public cbMessageID: number;
}
//记牌器
export class CMD_C_CardRecorderData extends CMD_Base{
	public wChairID: number;
}

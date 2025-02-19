import { error, isValid, Prefab, SpriteAtlas } from 'cc';
import _ from 'lodash';
// import { RW } from '../../../../../extensions/rwgameframe/assets/Game/RW';
// import { PoolMgr } from '../../../../Script/Utils/PoolUtil';
// import { GroupConfig, RummyConst } from '../Const/Const';
// import GameScene from '../GameScene';
// import { CMD_S_GameEnd, tagWeaveItem } from '../Socket/CMD';
// import CardUI from './CardUI';
// import { SelectCardData } from './HandCardLayer';
import { GroupConfig, RummyConst } from './Const';
import { AutoGroupType, CardGroup, GroupType, LiftType, RummyPoker } from './RummyPoker';
import RummyUtil from './RummyUtil';
export const Rummy_HandCard_Pool = "Rummy_HandCard_Pool";

export interface SendCardGroup {
	cardList: number[];
	groupCount: number;
}

export class CardLogic {
    private util: RummyUtil;
	private poker: RummyPoker;
	cardAutoGroup:AutoGroupType = null;
	public autoResult: AutoGroupType = null;
    private static instance: CardLogic;
	private cachedCardPrefab: Prefab | null = null; // Cache for the card prefab
	public cachedCardAtlas: SpriteAtlas = null;
	public static getInstance(): CardLogic {
        if (!CardLogic.instance) {
            CardLogic.instance = new CardLogic();
        }
        return CardLogic.instance;
    }
	constructor() {
        // 延迟初始化
        this.util = RummyUtil.getInstance();
		this.poker = RummyPoker.getInstance();
    }
	public Destroy(): void {
        CardLogic.instance = null;
    }
	public setWildcard(cardData: number): void {
		console.log(`Setting wildcard: 0x${cardData.toString(16)}`);
		this.util.setJoker(cardData);
	}

	async loadCardCached(){
		// if (this.cachedCardAtlas === null) {
        //     this.cachedCardAtlas = await RW.ResLoader.loadAsyncPromise<SpriteAtlas>("Rummy", `Res/PlistTexures/StaticPlist/commonCard`, SpriteAtlas);
        // }
		// // Load and cache prefab if it's not already cached
		// if (!this.cachedCardPrefab) {
		// 	this.cachedCardPrefab = await RW.ResLoader.loadAsyncPromise<Prefab>(
		// 		"Rummy", 
		// 		"Res/Prefab/rummy_cardNode1", 
		// 		Prefab
		// 	);
		// }
	}

	public getCardSprite(cardData: number): string {
		if (cardData === RummyUtil.getInstance().CARD_KING) return "3x_number_15";
		if (cardData === RummyUtil.getInstance().CARD_KING_2) return "3x_number_14";

		const color = this.util.suits(cardData);
		const value = this.util.values(cardData);
		return `3x_number_${color === 0 || color === 2 ? 'r' : 'b'}_${value}`;
	}
	public createNewCard(cardData: number) {
        // let card = PoolMgr.getNodeFromPool(Rummy_HandCard_Pool);
		
        // if (!isValid(card)) {
        //     console.log("Creating new card... No available instance from pool.");
        //     card = instantiate(this.cachedCardPrefab); // Use cached prefab
        // }

        // // Configure the card with its UI component
        // const cardComponent = card.getComponent(CardUI);
        // cardComponent.setCardObj(cardData);
        // cardComponent.cardReset();

        // return card;
    }


	public needWildcardIcon(cardData: number): boolean {
		return !this.util.isKingCard(cardData) && this.util.isMagicCard(cardData);
	}

	public sortCardList(cardList: number[]): void {
		cardList.sort((a, b) => a - b);
	}

	// Delete a specific card from the card list
	public deleteCard(outCard: number, outIndex: number, cardList: number[], count: number): [number[], number] {
		let findOutIndex = -1;
		for (let i = 0; i < cardList.length; i++) {
			if (cardList[i] == outCard && i == outIndex) {
				cardList.splice(i, 1);
				findOutIndex = i;
				break;
			}
		}

		if (findOutIndex < 0) {
			error("deleteOutCard data error!!!");
			return;
		}

		// for (let i = 0; i < RummyConst.MAX_WEAVE; i++) {
		// 	if (findOutIndex >= i && findOutIndex < (i + 1) * RummyConst.MAX_COUNT) {
		// 		console.log("deleteOutCard", i);
		// 		cardList.splice((i + 1) * RummyConst.MAX_COUNT - 1, 0, 0);

		// 		//如果这组只有一张牌
		// 		if (cardList[i * RummyConst.MAX_COUNT] == 0) {
		// 			//如果不是最后的牌组，则需要把后面的牌组挪到前面
		// 			if (cardList[(i + 1) * RummyConst.MAX_COUNT] != 0) {
		// 				cardList.splice(i * RummyConst.MAX_COUNT, RummyConst.MAX_COUNT);
		// 				for (let j = 0; j < RummyConst.MAX_COUNT; j++) {
		// 					cardList.push(0);
		// 				}
		// 			}

		// 			//牌组数量-1
		// 			count--;
		// 		}

		// 		break;
		// 	}
		// }

		// return [cardList, count];
	}

	private removeCardFromGroup(cardGroup: CardGroup[], groupIndex: number, cardData: number): boolean {
		const group = _.cloneDeep(cardGroup[groupIndex]); // 深拷贝单个组
		if (!group) {
			console.error('Invalid group index.');
			return false;
		}

		const cardIndex = group.cbCardData.findIndex(card => card === cardData);
		if (cardIndex === -1) {
			console.error('Card not found in the specified group.');
			return false;
		}

		// 移除指定卡牌
		group.cbCardData.splice(cardIndex, 1);

		// 更新 cardGroup 的引用
		if (group.cbCardData.length === 0) {
			cardGroup.splice(groupIndex, 1);
			console.log(`Group ${groupIndex} removed as it is now empty.`);
		} else {
			cardGroup[groupIndex] = group;
		}
		return true;
	}

	private removeCardFromGroupSimple(cardGroup: CardGroup[], groupIndex: number, cardData: number): boolean {
		if (groupIndex < 0 || groupIndex >= cardGroup.length) {
			console.error('Invalid group index.');
			return false;
		}
	
		const group = cardGroup[groupIndex];
		if (!group) {
			console.error('Group does not exist at the specified index.');
			return false;
		}

		const cardIndex = group.cbCardData.findIndex(card => card === cardData);
		if (cardIndex === -1) {
			console.error('Card not found in the specified group.');
			return false;
		}
		group.cbCardData.splice(cardIndex, 1);
	
		if (group.cbCardData.length === 0) {
			cardGroup.splice(groupIndex, 1);
			console.log(`Group ${groupIndex} removed as it is now empty.`);
		}else{
			cardGroup[groupIndex] = group;
		}
	
		return true;
	}
	
	public discardCardsFromGroup(
		index: number,
		cardData: number
	): CardGroup[] {
		let copyCardGroup = _.cloneDeep(this.autoResult.card_group);
		console.log(JSON.stringify(copyCardGroup));
		if (!this.removeCardFromGroup(copyCardGroup, index, cardData)) {
			this.autoResult.outCard = null;
			this.autoResult.outCardIndex = -1;
			console.error('Failed to discard card from group.');
			console.log("discardCardsFromGroup.......",JSON.stringify(this.autoResult.card_group));
			return this.autoResult.card_group;
		}
		return copyCardGroup.filter(item => item.cbCardData.length > 0);
	}

	public updateCardGroupData(
		originalName: string,
		targetName: string,
		cardData: number
	) {
		const originalIndex = parseInt(originalName.replace('layout', ''), 10);
		const targetIndex = parseInt(targetName.replace('layout', ''), 10);
		const result = _.cloneDeep(this.autoResult);
		const targetGroup = result.card_group[targetIndex];
		if (!targetGroup) {
			console.error('Invalid target group index.');
			return this.autoResult;
		}

		if (!this.removeCardFromGroup(result.card_group, originalIndex, cardData)) {
			console.error('Failed to move card from original group.');
			return this.autoResult;
		}
		targetGroup.cbCardData.push(cardData);
		this.autoResult = this.recalculateGroupData(result.card_group);
		return this.autoResult;

	}

	private recalculateGroupData(cardGroup: CardGroup[]) {
		let copyCardGroup = _.cloneDeep(cardGroup);
		const newCardGroups = this.formatGroupTypes(copyCardGroup);
		let lifeResult = this.poker.checkLife(newCardGroups);
		const totalScore = this.calcAllWeaveType(newCardGroups, lifeResult);
		const remainingCards = this.getRemainingCards(newCardGroups).remainCards;
		let outCard = remainingCards[0];
		let outCardIndex = newCardGroups.length - 1;
		if (remainingCards.length === 0) {
			let outInfo = this.poker.getOutCardFromGroups(newCardGroups);
			outCard = outInfo.card;
			outCardIndex = outInfo.index;
			// 给所有组合补上分数
			return {
				card_group: newCardGroups,
				canHu: lifeResult && remainingCards.length <= 1,
				outCard: outCard,
				outCardIndex: outCardIndex,
				totalScore: totalScore
			};
		} else {
			return {
				card_group: newCardGroups,
				canHu: lifeResult && remainingCards.length <= 1,
				outCardIndex: outCardIndex,
				outCard,
				totalScore,
			};
		}
	}

	normalGroup(cardGroup: CardGroup[]) {
		this.autoResult = this.recalculateGroupData(cardGroup);
	}

	selectCardGroup(index: number, cardData: number) {
		// const newCardDatas: number[] = [cardData];
		// let cardGroup = _.cloneDeep(this.autoResult.card_group);
		// cardGroup = this.addNewGroups(cardGroup, newCardDatas)
		// if (!this.removeCardFromGroupSimple(cardGroup, index, cardData)) {
		// 	console.error('Failed to remove card during user group operation.');
		// 	return this.autoResult; // Return the original if an error occurs
		// }
		// cardGroup = cardGroup.filter(item => item.cbCardData.length > 0);
		// if (cardGroup.length > RummyConst.MAX_WEAVE) {
		// 	return {card_group:cardGroup};
		// }
		// this.autoResult = this.recalculateGroupData(cardGroup);
		// return this.autoResult;
	}

	clickCard(){
		let resultLast = _.cloneDeep(this.autoResult.card_group);
        this.normalGroup(resultLast);
        let showCardData = this.autoResult.outCard;
        let outCardIndex = this.autoResult.outCardIndex;
        let group = this.discardCardsFromGroup(outCardIndex, showCardData);
        this.autoResult.card_group = group;
		this.updateTotalScore(group);
	}

	showCard(){
		this.autoResult =  _.cloneDeep(this.cardAutoGroup);

		let resultLast = _.cloneDeep(this.autoResult.card_group);
        this.normalGroup(resultLast);
        let showCardData = this.autoResult.outCard;
        let outCardIndex = this.autoResult.outCardIndex;

        let group = this.discardCardsFromGroup(outCardIndex, showCardData);
        this.autoResult.card_group = group;
		this.updateTotalScore(group);
	}

	updateTotalScore(group:CardGroup[]){
		let lifeResult = this.poker.checkLife(group);
		const totalScore = this.calcAllWeaveType(group, lifeResult);
		this.autoResult.totalScore = totalScore;
	}

	updateOutCardInfo(cardData:number,outCardIndex:number){
		this.autoResult.outCardIndex = outCardIndex;
		this.autoResult.outCard = cardData;
	}

	discardCard():CardGroup[]{
        let group = this.discardCardsFromGroup(this.autoResult.outCardIndex, this.autoResult.outCard);
		// this.autoResult.card_group = group;
		this.updateTotalScore(group);
		return group;
	}

	cardSelectUpdate(cardData:number,outCardIndex:number){
		let copyCardGroup = _.cloneDeep(this.autoResult.card_group);
		if (!this.removeCardFromGroup(copyCardGroup, outCardIndex, cardData)) {
			console.error('Failed to discard card from group.');
		}
		copyCardGroup.filter(item => item.cbCardData.length > 0);
		const newCardGroups = this.formatGroupTypes(copyCardGroup);
		let lifeResult = this.poker.checkLife(newCardGroups);
		const totalScore = this.calcAllWeaveType(newCardGroups, lifeResult);
		const remainingCards = this.getRemainingCards(newCardGroups).remainCards;
		let canHu = lifeResult && remainingCards.length == 0;
		this.autoResult.outCard = cardData;
		this.autoResult.outCardIndex = outCardIndex;
		this.autoResult.canHu = canHu;
		this.autoResult.totalScore = totalScore + this.util.getCardPoint(cardData);
	}

	// userGroup(selectDatas: SelectCardData[]) {
	// 	const newCardDatas: number[] = [];
	// 	const sortedDatas = selectDatas.sort((a, b) => b.index - a.index);
	// 	let copyCardGroup = _.cloneDeep(this.autoResult.card_group);
	// 	for (const data of sortedDatas) {
	// 		newCardDatas.push(data.cardData);
	// 	}
	// 	copyCardGroup = this.addNewGroups(copyCardGroup, newCardDatas)
	// 	for (const data of sortedDatas) {
	// 		if (!this.removeCardFromGroupSimple(copyCardGroup, data.index, data.cardData)) {
	// 			console.error('Failed to remove card during user group operation.');
	// 			return this.autoResult; // Return the original if an error occurs
	// 		}
	// 	}
	// 	copyCardGroup = copyCardGroup.filter(item => item.cbCardData.length > 0);
	// 	if (copyCardGroup.length > RummyConst.MAX_WEAVE) {
	// 		return {card_group:copyCardGroup};
	// 	}
	// 	this.autoResult = this.recalculateGroupData(copyCardGroup);
	// 	return this.autoResult;
	// }
	public addNewGroups(bestGroups: CardGroup[], remainingCards: number[]): CardGroup[] {
		// 创建浅拷贝，避免直接修改输入数组
		const newBestGroups = [...bestGroups];
		const remainingCardsCopy = [...remainingCards];
		let group: CardGroup = {
			cbCardData: remainingCardsCopy,
			cbWeaveKind: this.util.getGroupType(remainingCardsCopy),
			priority: this.util.getPriority(remainingCardsCopy),
		}
		newBestGroups.push(group);
		return newBestGroups; // 返回新的分组
	}


	public formatGroupTypes(groups: CardGroup[]): CardGroup[] {
		return groups
			.map(group => ({
				...group,
				cbCardData: [...group.cbCardData].sort((a, b) => a - b), // 将 cbCardData 从小到大排序
				cbWeaveKind: this.util.getGroupType(group.cbCardData),
				priority: this.util.getPriority(group.cbCardData),
			}))
			.sort((a, b) => {
				// 优先根据 priority 排序
				if (b.priority !== a.priority) {
					return b.priority - a.priority;
				}
				// 如果 priority 相同，按 cbCardData 数量排序
				return b.cbCardData.length - a.cbCardData.length;
			});
	}
	

	// getWeaveItemArrayCards(tagWeaveItemArray: Array<tagWeaveItem>): number[] {
	// 	// 合并所有 cbCardData 数组
	// 	const combinedCardData: number[] = tagWeaveItemArray.reduce((acc: number[], group: tagWeaveItem) => {
	// 		return acc.concat(group.cbCardData);
	// 	}, []);

	// 	return combinedCardData;
	// }

	// autoGroup(tagWeaveItemArray: Array<tagWeaveItem>) {
	// 	let cardList = this.getWeaveItemArrayCards(tagWeaveItemArray);
	// 	let result = this.poker.rummyGroup(cardList);
	// 	this.autoResult = _.cloneDeep(result);
	// 	this.cardAutoGroup = _.cloneDeep(result);
	// }

	public getRemainingCards(cardGroup: CardGroup[]): { remainCards: number[]; bestGroups: CardGroup[] } {
		const remainCards: number[] = [];
		const bestGroups: CardGroup[] = [];

		cardGroup.forEach(group => {
			if (this.poker.isValidGroup(group.cbCardData, group.cbWeaveKind)) {
				bestGroups.push(group);
			} else {
				remainCards.push(...group.cbCardData);
			}
		});
		return { remainCards, bestGroups };
	}


	public calcAllWeaveType(weaveList: CardGroup[], checkResult: boolean): number {
		const maxPoints = 80; // 最大分数限制
		let totalPoints = 0;

		// 辅助函数：计算分数
		const calculatePoints = (cards: number[]): number =>
			cards.reduce((sum, card) => sum + this.util.getCardPoint(card), 0);

		// 辅助函数：设置分组文本
		const setWeaveText = (weave: CardGroup, groupType: GroupType, points: number = 0): void => {
			weave.cbWeaveKind = groupType;
			weave.cbPoint = points;
			weave.text = groupType === GroupType.TYPE_SINGLE_LZ || points === 0
				? `${GroupConfig.TypeText[groupType]}`
				: `${GroupConfig.TypeText[groupType]}(${points})`;
		};
		if (checkResult) {
			for (const weave of weaveList) {
				// 根据 lifeType 设置 cbWeaveKind
				if (weave.lifeType === LiftType.FirstLife) {
					setWeaveText(weave, GroupType.TYPE_FIRST_LIFE);
				} else if (weave.lifeType === LiftType.SecondLife) {
					setWeaveText(weave, GroupType.TYPE_SECOND_LIFE);
				} else {
					const groupType = this.util.getGroupType(weave.cbCardData);
					if (RummyPoker.getInstance().isValidGroup(weave.cbCardData, groupType)) {
						setWeaveText(weave, groupType, 0);
					} else {
						const points = calculatePoints(weave.cbCardData);
						setWeaveText(
							weave,
							groupType === GroupType.TYPE_SINGLE_LZ ? GroupType.TYPE_SINGLE_LZ : GroupType.TYPE_NULL,
							points
						);
						totalPoints += points;
					}
				}
			}
		} else {
			const missInfo = RummyPoker.getInstance().missingLife(weaveList);
			for (const weave of weaveList) {
				const groupType = this.util.getGroupType(weave.cbCardData);
				if (RummyPoker.getInstance().isValidGroup(weave.cbCardData, groupType)) {
					if (missInfo.missingFirstLife) {
						const points = calculatePoints(weave.cbCardData);
						setWeaveText(weave, GroupType.TYPE_FIRST_LIFE_NEED, points);
						totalPoints += points;
					} else if (!missInfo.missingFirstLife && missInfo.missingSecondLife) {
						if (weave.lifeType === LiftType.FirstLife) {
							setWeaveText(weave, GroupType.TYPE_FIRST_LIFE, 0);
						} else {
							const points = calculatePoints(weave.cbCardData);
							setWeaveText(weave, GroupType.TYPE_SECOND_LIFE_NEED, points);
							totalPoints += points;
						}
					}
				} else {
					const points = calculatePoints(weave.cbCardData);
					setWeaveText(
						weave,
						groupType === GroupType.TYPE_SINGLE_LZ ? GroupType.TYPE_SINGLE_LZ : GroupType.TYPE_NULL,
						points
					);
					totalPoints += points;
				}
			}
		}
		return Math.min(totalPoints, maxPoints);
	}

	//获取牌型文字
	public static getGroupTypeStr(groupType: GroupType): string {
		return GroupConfig.TypeText[groupType];
	}
	getCardGroupData(cardGroup?:CardGroup[]): SendCardGroup {
        const list: Array<number> = [];
		if(!isValid(this.autoResult)){
			return;
		}
		if(!isValid(cardGroup)){
			cardGroup = this.autoResult.card_group;
		}
        for (let i = 0; i < RummyConst.MAX_WEAVE; i++) { // 遍历最大组合数
            if (cardGroup[i]) { // 检查组是否存在
                const count = cardGroup[i].cbCardData.length; // 获取当前组的卡牌数量
    
                for (let j = 0; j < RummyConst.MAX_COUNT; j++) { // 遍历每组的最大卡牌数
                    if (j < count) {
                        // 填充有效卡牌数据
                        const cardData = cardGroup[i].cbCardData[j];
                        list.push(cardData);
                    } else {
                        // 填充空位为 0
                        list.push(0);
                    }
                }
            } else {
                // 如果该组不存在，填充整个组为空位 0
                for (let j = 0; j < RummyConst.MAX_COUNT; j++) {
                    list.push(0);
                }
            }
        }
		return {cardList: list,groupCount:cardGroup.length};
    }

	// public arrayEndCard(cmd_table: CMD_S_GameEnd) {
		// const dealInfo = _.cloneDeep(cmd_table.dealInfo);
		// const weaveData = Array.from({ length: RummyConst.GAME_PLAYER }, (_, playerIndex) =>
		// 	Array.from({ length: RummyConst.MAX_WEAVE }, (_, weaveIndex) =>
		// 		dealInfo.WeaveItemArray[playerIndex * RummyConst.MAX_WEAVE + weaveIndex]
		// 	)
		// );
		// return weaveData.map(weaveList =>
		// 	weaveList
		// 		.map(weave => {
		// 			weave.cbCardData = weave.cbCardData.filter(card => card !== 0);
		// 			weave.cbCardCount = weave.cbCardData.length;
		// 			return weave;
		// 		})
		// 		.filter(weave => weave.cbCardCount > 0)
		// );
	// }

}
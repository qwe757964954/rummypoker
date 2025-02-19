import { CardLogic } from "./CardLogic";
import RummyUtil from "./RummyUtil";

export enum GroupType {
    TYPE_NULL = 0,           // Invalid
    TYPE_SINGLE = 1,         // Single card
    TYPE_PURE_SEQUENCE = 2,  // Pure sequence
    TYPE_SEQUENCE = 3,       // Sequence
    TYPE_PURE_SET = 4,       // Pure set今天
    TYPE_SET = 5,            // Set
    TYPE_SINGLE_LZ = 6,      // Single with wildcard
    TYPE_FIRST_LIFE = 7,     // First life
    TYPE_SECOND_LIFE = 8,    // Second life
    TYPE_FIRST_LIFE_NEED = 9,     // First life need
    TYPE_SECOND_LIFE_NEED = 10,     // First life need
}

export enum LiftType {
    NORMALLife = 0,
    FirstLife = 1, 
    SecondLife = 2,
}

export type CardGroup = {
    cbWeaveKind: GroupType;
    cbCardData: number[];
    cbCardCount?:number;	
    priority?: number;
    groupScore?: number;
    cbPoint?: number;
    text?:string;
    lifeType?:LiftType;
};


export interface AutoGroupType {
    card_group: CardGroup[];
    canHu: boolean;
    outCard: number;
    outCardIndex: number;
    totalScore: number;
    checkLife?:boolean;
}

export class RummyPoker {
    private static _instance: RummyPoker | null = null;

    public static getInstance(): RummyPoker {
        if (!this._instance) {
            this._instance = new RummyPoker();
        }
        return this._instance;
    }
    private util = RummyUtil.getInstance();
    public rummyGroup(card_list: number[]): AutoGroupType {
        const n = card_list.length;
        const SIZE = 1 << n;
        const dp: Record<number, { groups: CardGroup[]; score: number }> = {};
        const preprocessedGroups: Record<number, CardGroup[] | null> = {};
        const countBits = (num: number): number => {
            let count = 0;
            while (num) {
                count += num & 1;
                num >>= 1;
            }
            return count;
        };
        const isSubsetWorthProcessing = (subset: number): boolean => {
            const cardCount = countBits(subset);
            return cardCount >= 3; // 组内卡数少于 3 张时直接跳过
        };
        
        // 仅在需要时生成子集
        const preprocessGroupType = (): void => {
            for (let subset = 1; subset < SIZE; subset++) {
                if (!isSubsetWorthProcessing(subset)) continue; // 提前剪枝
                const cardValues = this.getCardsFromSubset(card_list, subset);
        
                // 提前检查癞子数量，若不可能组成组合，直接跳过
                const wildcards = cardValues.filter(card => this.util.isMagicCard(card));
                if (wildcards.length > 4) continue; // 假设最多允许 4 个癞子形成组合
        
                preprocessedGroups[subset] = this.getGroupTypes(cardValues) || null;
            }
        };
        
        const getBestGroups = (state: number): { groups: CardGroup[]; score: number } => {
            if (state === 0) {
                const remainingCards = this.getRemainingCards(card_list, state);
                const canHu = this.checkLife([]);
                return {
                    groups: [],
                    score: canHu && remainingCards.length === 0 ? -Infinity : this.calculateCombinedScore(canHu,[], remainingCards),
                };
            }

            if (dp[state]) return dp[state];

            let bestResult: { groups: CardGroup[]; score: number } = { groups: [], score: Infinity };

            for (let subset = state; subset; subset = (subset - 1) & state) {
                const groupOptions = preprocessedGroups[subset];
                if (!groupOptions) continue;

                for (const groupData of groupOptions) {
                    const remainingState = state ^ subset;
                    const remainingGroupsData = getBestGroups(remainingState);

                    const currentResult = [groupData, ...remainingGroupsData.groups];
                    const remainingCards = this.getRemainingCards(card_list, currentResult);
                    const canHu = this.checkLife(currentResult);
                    let groupScore = CardLogic.getInstance().calcAllWeaveType(currentResult,canHu);
                    if (canHu && remainingCards.length === 0) {
                        dp[state] = { groups: currentResult, score: -Infinity };
                        return dp[state];
                    }
                    const remainingCardPoints = remainingCards.reduce((sum, card) => sum + this.util.getCardPoint(card), 0);
                    let currentScore = groupScore + remainingCardPoints;
                    if (this.isBetterResult(currentScore, bestResult, remainingCards, card_list)) {
                        bestResult = { groups: currentResult, score: currentScore };
                    }
                }
            }
            if (bestResult.score !== Infinity) {
                dp[state] = bestResult; // 只存非 Infinity 结果
            }
            return bestResult;
        };

        preprocessGroupType();
        const bestGroupsData = getBestGroups(SIZE - 1);
        let bestGroups = bestGroupsData.groups;
        let checkResult = this.checkLife(bestGroups);
        const missInfo = RummyPoker.getInstance().missingLife(bestGroups);
        if(missInfo.missingFirstLife){
            bestGroups = [];
        }
        const remainingCards = this.getRemainingCards(card_list, bestGroups);
        let outCard = remainingCards[0]; // 默认出牌
        let outCardIndex = bestGroups.length;
        let allGroup = bestGroups;
        if (remainingCards.length === 0) {
            let formatGroup = CardLogic.getInstance().formatGroupTypes(allGroup);
            let outInfo = this.getOutCardFromGroups(formatGroup);
            outCard = outInfo.card;
            outCardIndex = outInfo.index;
            checkResult = this.checkLife(formatGroup);
            // 给所有组合补上分数
            let totalScore = CardLogic.getInstance().calcAllWeaveType(formatGroup,checkResult);
            const canHu = checkResult && remainingCards.length <= 1;
            return {
                card_group: formatGroup,
                checkLife:checkResult,
                canHu,
                outCard: outCard,
                outCardIndex:outCardIndex,
                totalScore: totalScore
            };
        }else{
            // 添加无效组
            allGroup = this.addInvalidGroups(bestGroups, remainingCards);
            let formatGroup = CardLogic.getInstance().formatGroupTypes(allGroup);
            checkResult = this.checkLife(formatGroup);
            const canHu = checkResult && remainingCards.length <= 1;
            let totalScore = CardLogic.getInstance().calcAllWeaveType(formatGroup,checkResult);
            return {
                card_group: formatGroup,
                checkLife:checkResult,
                canHu,
                outCard: outCard,
                outCardIndex:outCardIndex,
                totalScore: totalScore
            };
        }
    }
    public getOutCardFromGroups(bestGroups: CardGroup[]): { card: number; index: number } | null {
        for (let groupIndex = 0; groupIndex < bestGroups.length; groupIndex++) {
            const group = bestGroups[groupIndex];
            if (group.cbCardData.length > 3) {
                for (let i = 0; i < group.cbCardData.length; i++) {
                    const card = group.cbCardData[i];
                    const testGroupList = group.cbCardData.filter(c => c !== card);
                    const testGroup: CardGroup = { ...group, cbCardData: testGroupList };
                    const testGroups = bestGroups.map((g, index) => (index === groupIndex ? testGroup : g));
    
                    if (this.isValidGroup(testGroupList, group.cbWeaveKind) && this.checkLife(testGroups)) {
                        return { card: card, index: groupIndex }; // 返回组的下标作为 index
                    }
                }
            }
        }
        return null;
    }
    
    public isValidGroup(cardList: number[], groupType: GroupType): boolean {
        switch (groupType) {
            case GroupType.TYPE_FIRST_LIFE: return this.util.isPureSequence(cardList);
            case GroupType.TYPE_SECOND_LIFE: return this.util.isPureSequence(cardList) || this.util.isSequence(cardList);
            case GroupType.TYPE_PURE_SEQUENCE: return this.util.isPureSequence(cardList);
            case GroupType.TYPE_SEQUENCE: return this.util.isSequence(cardList);
            case GroupType.TYPE_PURE_SET: return this.util.isPureSet(cardList);
            case GroupType.TYPE_SET: return this.util.isSet(cardList);
            default: return false;
        }
    }
    private getCardsFromSubset(cards: number[], subset: number): number[] {
        return cards.filter((_, index) => subset & (1 << index));
    }

    public getGroupTypes(cardValues: number[]): CardGroup[] {
        const groupTypes: CardGroup[] = [];
        if (this.util.isPureSequence(cardValues)) groupTypes.push({ cbWeaveKind: GroupType.TYPE_PURE_SEQUENCE, cbCardData: cardValues, priority: 4, groupScore: 0 });
        if (this.util.isSequence(cardValues)) groupTypes.push({ cbWeaveKind: GroupType.TYPE_SEQUENCE, cbCardData: cardValues, priority: 3, groupScore: 0 });
        if (this.util.isPureSet(cardValues)) groupTypes.push({ cbWeaveKind: GroupType.TYPE_PURE_SET, cbCardData: cardValues, priority: 3, groupScore: 0 });
        if (this.util.isSet(cardValues)) groupTypes.push({ cbWeaveKind: GroupType.TYPE_SET, cbCardData: cardValues, priority: 2, groupScore: 0 });
        return groupTypes;
    }

    private getRemainingCards(allCards: number[], groups: CardGroup[] | number): number[] {
        const usedCardIndexes = new Set<number>();
    
        if (typeof groups === 'number') {
            return allCards.filter((_, index) => !(groups & (1 << index)));
        }
    
        groups.forEach(group => {
            group.cbCardData.forEach(card => {
                const index = allCards.findIndex((c, i) => c === card && !usedCardIndexes.has(i));
                if (index !== -1) usedCardIndexes.add(index);
            });
        });
    
        return allCards.filter((_, index) => !usedCardIndexes.has(index));
    }

    public addInvalidGroups(bestGroups: CardGroup[], remainingCards: number[]): CardGroup[] {
        // 创建浅拷贝，避免直接修改输入数组
        const newBestGroups = [...bestGroups];
        const remainingCardsCopy = [...remainingCards];
    
        if (remainingCardsCopy.length > 0) {
            const suitsGroups: Record<number, number[]> = {};
    
            for (const card of remainingCardsCopy) {
                const suit = this.util.suits(card);
                if (!suitsGroups[suit]) suitsGroups[suit] = [];
                suitsGroups[suit].push(card);
            }
    
            for (const suitGroup of Object.values(suitsGroups)) {
                // 不使用 Set 以保留重复卡牌
                if (newBestGroups.length < 6) {
                    newBestGroups.push({
                        cbWeaveKind: GroupType.TYPE_NULL,
                        cbCardData: [...suitGroup], // 保留重复卡牌
                        priority: 0,
                        groupScore: 0,
                    });
                } else {
                    const maxGroup = { ...newBestGroups[5] }; // 浅拷贝 maxGroup
                    maxGroup.cbCardData = [...maxGroup.cbCardData, ...suitGroup];
    
                    // 去重仅在合并时进行
                    // maxGroup.cbCardData = [...new Set(maxGroup.cbCardData)];
    
                    // 替换更新后的 maxGroup
                    newBestGroups[5] = maxGroup;
                    break;
                }
            }
        }
        return newBestGroups; // 返回新的分组
    }
    

    private isBetterResult(
        currentScore: number,
        bestResult: { groups: CardGroup[]; score: number },
        remainingCards: number[],
        allCards: number[],
    ): boolean {
        const bestRemainingCards = this.getRemainingCards(allCards, bestResult.groups);
        // Priority 1: Favor results with `checkResult` being true
        // console.log(checkResult)
        // if (checkResult && !bestCheckResult) return true;
        // if (!checkResult && bestCheckResult) return false;
        
        if (remainingCards.length === 1 && bestRemainingCards.length > 1) return true;
        if (remainingCards.length > 1 && bestRemainingCards.length === 1) return false;

        // const remainingCardPoints = remainingCards.reduce((sum, card) => sum + this.util.getCardPoint(card), 0);
        // const bestRemainingCardPoints = bestRemainingCards.reduce((sum, card) => sum + this.util.getCardPoint(card), 0);
        
        // // Priority 2: Favor results with lower remaining card points
        // if (remainingCardPoints < bestRemainingCardPoints) return true;
        // if (remainingCardPoints > bestRemainingCardPoints) return false;
    
        // Priority 3: Favor results with higher score
        if (currentScore < bestResult.score) return true;
        if (currentScore > bestResult.score) return false;
    
        // Priority 4: Favor results with fewer remaining cards
        return remainingCards.length < bestRemainingCards.length;
    }

    private calculateCombinedScore(checkResult:boolean,groups: CardGroup[], remainingCards: number[]): number {
        if (remainingCards.length === 0 && this.checkLife(groups)) {
            return Infinity;
        }
        let pureSetScore = checkResult ? 8 : 5;
        let score = 0;
        groups.forEach(group => {
            switch (group.cbWeaveKind) {
                case GroupType.TYPE_PURE_SEQUENCE: score += 10; break;
                case GroupType.TYPE_SEQUENCE:
                     let point = group.cbCardData.reduce((sum, card) => sum + this.util.getCardPoint(card), 0);
                     score += 7 + point / 100; 
                     break;
                case GroupType.TYPE_PURE_SET: score += pureSetScore; break;
                case GroupType.TYPE_SET: score += 4; break;
                case GroupType.TYPE_NULL: score -= group.cbCardData.length; break;
            }
        });

        return score + groups.length * 2;
    }

    public checkLife(bestGroups: CardGroup[]): boolean {
        let hasFirstLife = false;
        let hasSecondLife = false;
    
        // 快速检查：如果没有 TYPE_PURE_SEQUENCE，直接返回 false
        const hasPureSequence = bestGroups.some(
            weave => this.util.getGroupType(weave.cbCardData) === GroupType.TYPE_PURE_SEQUENCE
        );
        if (!hasPureSequence) return false;
    
        // 初始化所有牌组的生命类型为 NORMALLife
        bestGroups.forEach(weave => {
            weave.lifeType = LiftType.NORMALLife;
        });
    
        // 遍历牌组，判断生命类型
        for (const weave of bestGroups) {
            const cardType = this.util.getGroupType(weave.cbCardData);
    
            if (cardType === GroupType.TYPE_PURE_SEQUENCE) {
                if (!hasFirstLife) {
                    hasFirstLife = true;
                    weave.lifeType = LiftType.FirstLife;
                } else if (!hasSecondLife) {
                    hasSecondLife = true;
                    weave.lifeType = LiftType.SecondLife;
                }
            } else if (cardType === GroupType.TYPE_SEQUENCE && !hasSecondLife) {
                hasSecondLife = true;
                weave.lifeType = LiftType.SecondLife;
            }
    
            // 如果已经找到两种生命，提前退出
            if (hasFirstLife && hasSecondLife) break;
        }
    
        return hasFirstLife && hasSecondLife;
    }
    public missingLife(bestGroups: CardGroup[]): { missingFirstLife: boolean; missingSecondLife: boolean } {
        let hasFirstLife = false;
        let hasSecondLife = false;
    
        // 快速检查：如果没有 TYPE_PURE_SEQUENCE，第一生命一定缺失
        if (!bestGroups.some(weave => this.util.getGroupType(weave.cbCardData) === GroupType.TYPE_PURE_SEQUENCE)) {
            hasFirstLife = false;
        }
    
        for (let i = 0; i < bestGroups.length; i++) {
            const weave = bestGroups[i];
            const cardType = this.util.getGroupType(weave.cbCardData);
    
            if (cardType === GroupType.TYPE_PURE_SEQUENCE) {
                if (!hasFirstLife) {
                    hasFirstLife = true; // 找到第一生命
                    weave.lifeType = LiftType.FirstLife;
                } else if (!hasSecondLife) {
                    hasSecondLife = true; // 找到第二生命
                    weave.lifeType = LiftType.SecondLife;
                }
            } else if (cardType === GroupType.TYPE_SEQUENCE) {
                if (!hasSecondLife) {
                    hasSecondLife = true; // 顺子可作为第二生命
                    weave.lifeType = LiftType.SecondLife;
                }
            }
            if (hasFirstLife && hasSecondLife) {
                break; // 如果两种生命都找到，可以提前退出
            }
        }
    
        return {
            missingFirstLife: !hasFirstLife, // 第一生命是否缺失
            missingSecondLife: !hasSecondLife, // 第二生命是否缺失
        };
    }
    
}

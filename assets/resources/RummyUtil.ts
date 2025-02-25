import { GroupType } from "./RummyPoker";

export default class RummyUtil {
    public CARD_KING = 0x41; // Example Joker value
    public CARD_KING_2 = 0x42; // Example Joker value
    private MagicValueIsKing = false;
    private MagicValue = 10; // Example Magic value for joker
    public G_SUIT_NUM: number = 16;
    private static _instance: RummyUtil | null = null;
    private m_cbCardDataArray: number[] = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,  //方块 A - K
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,  //梅花 A - K
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,  //红桃 A - K
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,  //黑桃 A - K
        0x41, 0x42
    ];
    public static getInstance(): RummyUtil {
        if (!this._instance) {
            this._instance = new RummyUtil();
        }
        return this._instance;
    }
    public isMagicCard(cardData: number): boolean {
        return cardData === this.CARD_KING || cardData === this.CARD_KING_2 || (!this.MagicValueIsKing && this.values(cardData) === this.MagicValue);
    }
    /**
 * 根据 MagicValue 获取一副牌中的癞子数组
 * @returns {number[]} 癞子数组
 */
    public getMagicCards(): number[] {
        return this.m_cbCardDataArray.filter(card => this.isMagicCard(card));
    }

    public isKingCard(cardData: number): boolean {
        return cardData === this.CARD_KING || cardData === this.CARD_KING_2;
    }

    public setJoker(cardData: number): void {
        this.MagicValue = this.values(cardData);
        this.MagicValueIsKing = this.isKingCard(cardData);
    }

    public suits(cardData: number): number {
        return this.isKingCard(cardData) ? 5 : Math.floor(cardData / this.G_SUIT_NUM);
    }

    public values(cardData: number): number {
        return cardData % this.G_SUIT_NUM;
    }

    public getCardPoint(cardData: number): number {
		if (!cardData || this.isMagicCard(cardData) || this.isKingCard(cardData)) return 0;

		const value = this.values(cardData);
		return value >= 10 || value === 1 ? 10 : value;
	}
    public isSequence(group: number[]): boolean {
        if (group.length < 3) return false;

        // 辅助函数：排序并按值提取
        const sortedGroup = group.slice().sort((a, b) => this.values(a) - this.values(b));
        const nonMagicCards = sortedGroup.filter(card => !this.isMagicCard(card));
        const suit = this.suits(nonMagicCards[0]);

        if (!nonMagicCards.every(card => this.suits(card) === suit)) {
            return false; // 只有当花色不一致时才返回 false
        }

        // 检查是否为纯顺子，但不直接返回 false
        if (this.isPureSequence(nonMagicCards)) {
            // 如果是纯顺子，不用进一步检查
            return true;
        }
        // 检查是否有重复的非癞子牌
        const uniqueValues = new Set(nonMagicCards.map(card => this.values(card)));
        if (uniqueValues.size !== nonMagicCards.length) {
            return false;
        }

        // 如果全部是癞子且超过3张，直接返回 false
        const jokerCount = group.filter(card => this.isMagicCard(card)).length;
        if (jokerCount >= 3 && jokerCount === group.length) {
            return false;
        }
        const magicCards = sortedGroup.filter(card => this.isMagicCard(card));

        // 特殊处理 A：可以为 1 或 14
        const containsAce = nonMagicCards.some(card => this.values(card) === 1);
        if (containsAce) {
            const valuesAs1 = nonMagicCards.map(card => (this.values(card) === 1 ? 1 : this.values(card)));
            let valuesAs14 = nonMagicCards.map(card => (this.values(card) === 1 ? 14 : this.values(card)));
            valuesAs14 = valuesAs14.sort((a, b) => this.values(a) - this.values(b));
            return this.isConsecutive([...magicCards, ...valuesAs1]) || this.isConsecutive([...magicCards, ...valuesAs14]);
        }

        // 正常连续性检查：保留癞子原始 cardData
        const values = nonMagicCards.map(card => this.values(card));
        const combinedGroup = [...magicCards, ...values];
        return this.isConsecutive(combinedGroup);
    }

    // 检查是否连续
    public isConsecutive(cardValues: number[]): boolean {
        let jokerCount = 0;
        let prevValue: number | null = null;

        for (const currentValue of cardValues) {
            if (this.isMagicCard(currentValue)) {
                jokerCount++;
            } else {
                if (prevValue !== null && currentValue > prevValue + 1 + jokerCount) {
                    return false;
                }
                jokerCount -= Math.max(0, currentValue - (prevValue ?? currentValue) - 1);
                prevValue = currentValue;
            }
        }

        return jokerCount >= 0;
    }


    public isPureSequence(group: number[]): boolean {
        const suit = this.suits(group[0]);


        // 检查是否所有牌为同一花色
        if (!group.every(card => this.suits(card) === suit)) {
            return false;
        }
        // 将牌按点数排序
        const cardValues = group.map(card => this.values(card));
        const sortedValues = cardValues.slice().sort((a, b) => a - b);

        // 特殊处理A：可以作为1或14
        const containsAce = sortedValues.includes(1);
        if (containsAce) {
            const valuesAs1 = sortedValues.map(value => value === 1 ? 1 : value);
            const valuesAs14 = sortedValues.map(value => value === 1 ? 14 : value).sort((a, b) => a - b);
            if (this.isPureConsecutive(valuesAs1) || this.isPureConsecutive(valuesAs14)) {
                return true;
            }
        }

        return this.isPureConsecutive(sortedValues);
    }

    public isPureConsecutive(group: number[]): boolean {
        if (group.length < 3) return false; // 限制顺子的长度为3到6张

        // const nonJokerCards = group.filter(card => !this.isMagicCard(card)).sort((a, b) => a - b);
        // if (nonJokerCards.length === 0) return false;

        // 检查非癞子牌的连续性
        for (let i = 1; i < group.length; i++) {
            if (group[i] !== group[i - 1] + 1) {
                return false;
            }
        }

        return true;
    }

    public isJokers(group: number[]): boolean{
        const jokerCount = group.filter(card => this.isMagicCard(card)).length;
        if (jokerCount === group.length) return true; // 癞子数量等于牌组叫全Jocker
        return false;
    }

    public isSet(group: number[]): boolean {
        if (group.length < 3 || group.length > 4) return false;

        const jokerCount = group.filter(card => this.isMagicCard(card)).length;
        if (jokerCount >= 3 && jokerCount === group.length) return false; // 癞子数量不能全部是3张以上

        const nonJokerCards = group.filter(card => !this.isMagicCard(card));
        if (nonJokerCards.length === 0) return false;

        const value = this.values(nonJokerCards[0]);
        if (!nonJokerCards.every(card => this.values(card) === value)) return false;

        const suitsSet = new Set(nonJokerCards.map(card => this.suits(card)));
        if (suitsSet.size !== nonJokerCards.length) return false;

        return nonJokerCards.length + jokerCount >= 3;
    }

    public isPureSet(group: number[]): boolean {
        if (group.length < 3 || group.length > 4) return false;

        // 不允许有癞子
        if (group.some(card => this.isMagicCard(card))) return false;

        const value = this.values(group[0]);
        if (!group.every(card => this.values(card) === value)) return false;

        const suitsSet = new Set(group.map(card => this.suits(card)));
        if (suitsSet.size !== group.length) return false;

        return true; // 满足纯set的条件
    }

    public getGroupType(cardList: number[]): GroupType {
		if (!cardList || cardList.length === 0) return GroupType.TYPE_NULL;
		if(this.isJokers(cardList)) return GroupType.TYPE_SINGLE_LZ;
		if (cardList.length === 1) return GroupType.TYPE_SINGLE;

		if (this.isPureSequence(cardList)) return GroupType.TYPE_PURE_SEQUENCE;
		if (this.isSequence(cardList)) return GroupType.TYPE_SEQUENCE;
		if (this.isPureSet(cardList)) return GroupType.TYPE_PURE_SET;
		if (this.isSet(cardList)) return GroupType.TYPE_SET;

		return GroupType.TYPE_NULL;
	}
    public getPriority(cardList: number[]): GroupType {
		if (!cardList || cardList.length === 0) return 0;
		if(this.isJokers(cardList)) return 0;
		if (cardList.length === 1) return 0;

		if (this.isPureSequence(cardList)) return 4;
		if (this.isSequence(cardList)) return 3;
		if (this.isPureSet(cardList)) return 2;
		if (this.isSet(cardList)) return 1;

		return 0;
	}
}
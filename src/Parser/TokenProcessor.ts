export type TokenGroup = {
	token: string;
	value: string;
	range: {
		start: number;
		end: number;
		length: number;
	}
}

export class TokenProcessor {
	public tokens: string[] = [];
	public currentIndex     = 0;

	constructor(tokens: string[]) {
		this.tokens = tokens;
	}


	public getRange(start: number, end: number): string[] {
		return this.tokens.slice(start, end);
	}

	public consume(from: number, to: number): void;
	public consume(number: number): void;
	public consume(from: number, to?: number): void {
		const newTokens = [];
		for (let i = 0; i < this.tokens.length; i++) {
			if (from !== undefined && to !== undefined) {
				if (i >= from && i <= to) {
					newTokens.push(this.tokens[i]);
				}
				continue;
			}

			if (from !== undefined && i >= from) {
				newTokens.push(this.tokens[i]);
			}
		}
		this.tokens = newTokens;
	}

	public get(index: number): string {
		return this.tokens[index];
	}

	public get length(): number {
		return this.tokens.length;
	}

	public get current(): string {
		return this.tokens[this.currentIndex];
	}

	public exists(index: number): boolean {
		return this.tokens[index] !== undefined;
	}

	public next(): string {
		return this.exists(this.currentIndex + 1) ? this.tokens[this.currentIndex + 1] : undefined;
	}

	public nextAre(tokens: string[]): boolean {
		for (let i = 0; i < tokens.length; i++) {
			if (this.tokens[this.currentIndex + i] !== tokens[i]) {
				return false;
			}
		}
		return true;
	}

	public nextIs(value: string): boolean {
		return this.next() === value;
	}

	public nextIsNot(value: string): boolean {
		return this.next() !== value;
	}

	public nextIsOneOf(values: string[]): boolean {
		return values.includes(this.next());
	}

	public nextIsNotOneOf(values: string[]): boolean {
		return !values.includes(this.next());
	}

	public previous(): string {
		return this.exists(this.currentIndex - 1) ? this.tokens[this.currentIndex - 1] : undefined;
	}

	public previousIs(value: string): boolean {
		return this.previous() === value;
	}

	public previousIsNot(value: string): boolean {
		return this.previous() !== value;
	}

	public previousIsOneOf(values: string[]): boolean {
		return values.includes(this.previous());
	}

	public previousIsNotOneOf(values: string[]): boolean {
		return !values.includes(this.previous());
	}

	public currentIs(value: string): boolean {
		return this.current === value;
	}

	public currentIsNot(value: string): boolean {
		return this.current !== value;
	}

	public currentIsOneOf(values: string[]): boolean {
		return values.includes(this.current);
	}

	public currentIsNotOneOf(values: string[]): boolean {
		return !values.includes(this.current);
	}



	public skip(amount: number): void;
	public skip(): void;
	public skip(amount?: number): void {
		if (amount === undefined) {
			amount = 1;
		}
		this.currentIndex += amount;
	}

	public skipUntil(value: string): void {
		while (this.currentIsNot(value)) {
			this.skip();
		}
	}

	public getAndConsume(index: number): string;
	public getAndConsume(): string;
	public getAndConsume(index?: number): string {
		if (index === undefined) {
			index = this.currentIndex;
		}
		const token = this.tokens[index];
		this.consume(index + 1);
		return token;
	}


	public rangesOfNext(value: string[]): TokenGroup[] {
		const groups: TokenGroup[] = [];

		let currentGroupToken        = null;
		let currentGroup: TokenGroup = null;

		let currentValue = "";
		let startIndex   = 0;
		let endIndex     = 0;

		const addGroup = () => {
			currentGroup.value = currentValue;
			currentGroup.range.start  = startIndex;
			currentGroup.range.end    = endIndex;
			currentGroup.range.length = endIndex - startIndex;
			groups.push(currentGroup);
		};

		for (let i = 0; i < this.tokens.length; i++) {
			const token = this.tokens[i];
			if (value.includes(token)) {
				// If we have reached a new group, store the current group and reset the current value
				if (currentGroupToken) {
					addGroup();
				}
				currentGroupToken = token;
				currentGroup      = {
					token,
					range : {
						start  : i,
						end    : 0,
						length : 0
					},
					value : "",
				};
				currentValue      = "";
				startIndex        = i;
			} else {
				// Otherwise, add the token to the current value
				currentValue += `${token} `;
				endIndex = i;
			}
		}

		// Don't forget to store the final group
		if (currentGroupToken) {
			addGroup();
		}

		return groups;
	}

}

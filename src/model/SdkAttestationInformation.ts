/**
 * Copyright © 2025 Nevis Security AG. All rights reserved.
 */

export class SdkAttestationInformation {
	onlySurrogateBasic: boolean;
	onlyDefault: boolean;
	strict: boolean;

	constructor(options: { onlySurrogateBasic: boolean; onlyDefault: boolean; strict: boolean }) {
		this.onlySurrogateBasic = options.onlySurrogateBasic;
		this.onlyDefault = options.onlyDefault;
		this.strict = options.strict;
	}
}

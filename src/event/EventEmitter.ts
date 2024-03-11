/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { EventEmitter } from 'eventemitter3';

export enum EventType {
	StartFingerprintVerification = 'startFingerprintVerification',
	StopFingerprintVerification = 'stopFingerprintVerification',
}

export const eventEmitter = new EventEmitter();

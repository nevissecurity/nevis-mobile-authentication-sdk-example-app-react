/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React from 'react';

import EventEmitter from 'eventemitter3';

import { eventEmitter } from './EventEmitter';

const EventContext = React.createContext<EventEmitter>(eventEmitter);

const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <EventContext.Provider value={eventEmitter}>{children}</EventContext.Provider>;
};

export default EventProvider;

export const useEvent = () => {
	return React.useContext(EventContext);
};

// utils/eventEmitter.js

class EventEmitter {
  constructor() {
    this.events = {};
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener); // Return an unsubscribe function
  }

  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
}

const eventEmitter = new EventEmitter();

export const emitEvent = (event, data) => {
  eventEmitter.emit(event, data);
};

export const addEventListener = (event, listener) => {
  eventEmitter.on(event, listener);
  // Return a function to remove the listener, using the event and listener reference
  return () => eventEmitter.off(event, listener);
};

export const removeEventListener = (unsubscribe) => {
  unsubscribe(); // Directly call the unsubscribe function
};

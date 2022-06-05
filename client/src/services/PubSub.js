/**********
 *
 * pubsub.publish()
 * pubsub.subscribe()
 * pubsub.unsubscribe()
 *
 * */

export const PubSub = {
  events: {
    IS_MOBILE: 'IsMobile',
    SNACKBAR_PROVIDER: 'SnackbarProvider',
  },
  publish(evName, data) {
    //publish the event to anyone who is subscribed
    if (!!this.events[evName]) {
      this.events[evName].forEach((f) => {
        f(data);
      });
    }
  },
  subscribe(evName, fn) {
    //add an event with a name as new or to existing ...
    this.events[evName] = this.events[evName] || [];
    this.events[evName].push(fn);
  },
  unsubscribe(evName, fn) {
    //remove an event function by name
    if (!!this.events[evName]) {
      this.events[evName] = this.events[evName].filter((f) => f !== fn);
    }
  },
};

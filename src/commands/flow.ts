import { Command, flags } from "@oclif/command";

interface DynamicObject<T> {
  [key: string]: T;
}

interface Actions {
  [key: string]: { from: string; to: string };
}
interface Events {
  [key: string]: { enter: () => Promise<void>; exit: () => Promise<void> };
}

interface StateMachineConfig {
  initial: string;
  actions: Actions;
  events: Events;
}

class StateMachine {
  private _state: string;

  constructor(private config: StateMachineConfig) {
    this._state = config.initial;
  }

  async action(name: string) {
    const events = this.config.events[name];
    if (events) {
      await events.enter();
      await events.exit();
    }
  }

  get state(): string {
    return this._state;
  }
}

export default class Flow extends Command {
  async run() {
    const sm = new StateMachine({
      initial: "initial",
      actions: {
        getInput: { from: "initial", to: "getInput" },
      },
      events: {
        getInput: {
          async enter() {
            console.log("enter");
          },
          async exit() {
            console.log("exit");
          },
        },
      },
    });

    sm.action("initial");
  }
}


/**
 * States the "shooting robot" can have
 * 
 * Object.freeze makes Enum objects to be immutable
 * Symbol makes objects Enum objecst to be unique
 */
const R_States = Object.freeze(
    {
        // waiting for event from user
        IDLE: Symbol("idle"),
        
        // shoot-button clicked, loading bullet (longer time bigger bullet)
        LOADING_BULLET: Symbol("loading_bullet"),

        // bullet has been fired and is traveling
        BULLET_TRAVELING: Symbol("bullet_traveling"),

        // bullet "hit" an object during trajectory
        HIT: Symbol("hit"),

        // trajectory ended without "hit"
        NO_HIT: Symbol("no_hit")
    }
);

/**
 * Events the "shooting robot" must listen to
 */
const R_Events = Object.freeze(
    {
        // user clicked shoot button
        SHOOT_STARTED: Symbol("shoot_started"),
        // user released shoot button
        SHOOT_ENDED: Symbol("shoot_ended"),
        // bullet hit an object during trajectory
        BULLET_COLLIDED: Symbol("bullet_collided"),
        // bullet reached end without hitting objects
        END_OF_TRAJECTORY: Symbol("end_of_trajectory"),
        // timing event (used to update counters, blink UI, etc.) before going to IDLE state
        RESTART: Symbol("restart")
    }
);

/**
 * Finite State Machine for Robot
 * Using symbol as key of the dictionary
 */
function FSM_Robot () {
    this.transitions = {
        // symbol as key
        [R_States.IDLE]: {
            [R_Events.SHOOT_STARTED]: [R_States.LOADING_BULLET]
        },
        [R_States.LOADING_BULLET]: {
            [R_Events.SHOOT_ENDED]: [R_States.BULLET_TRAVELING]
        },
        [R_States.BULLET_TRAVELING]: {
            [R_Events.BULLET_COLLIDED]: [R_States.HIT],
            [R_Events.END_OF_TRAJECTORY]: [R_States.NO_HIT]
        },
        [R_States.HIT]: {
            [R_Events.RESTART]: [R_States.IDLE]
        },
        [R_States.NO_HIT]: {
            [R_Events.RESTART]: [R_States.IDLE]
        }
    };

    // initialization
    this.state = R_States.IDLE;
    this.prev_state = undefined;
}

/**
 * Provides the destination-state by checking the transition from the current state with given the event_
 * @param {R_Events} event_ 
 * @return {R_States} destination_state
 */
FSM_Robot.prototype.get_dest_state = function (event_) {

    // get possible transitions from current state
    const _transitions_from_state = self.transitions[this.state];

    if (undefined === _transitions_from_state) {
        console.error("State unhandled: " + this.state);
        return undefined;
    }
    else {
        // get destination state using the event_
        const _dest = _transitions_from_state[event_];
        if (undefined === _dest) {
            log.error("Event not allowed: " + event_ + " in current state: " + self.state);
        }
        return _dest;
    }
}

/**
 * Performs 2 operations:
 *      1. Gets the destination-state from the current-state given the event_
 *      2. Sets the destination-state as current state
 * @param {R_Events} event_ 
 * @return {Bool} true transited properly (current state is now dest state), false otherwise
 */
FSM_Robot.prototype.transit = function (event_) {
    
    const _dest = self.get_dest_state(event_);

    if (undefined !== _dest) {
        self.state = _dest;
        return true;
    }
    else {
        return false;
    }
}

export default {
    FSM_Robot,
    R_Events,
    R_States
}
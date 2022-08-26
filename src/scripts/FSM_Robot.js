
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
        // symbol as key needs []
        [R_States.IDLE]: {
            [R_Events.SHOOT_STARTED]: R_States.LOADING_BULLET
        },
        [R_States.LOADING_BULLET]: {
            [R_Events.SHOOT_ENDED]: R_States.BULLET_TRAVELING
        },
        [R_States.BULLET_TRAVELING]: {
            [R_Events.BULLET_COLLIDED]: R_States.HIT,
            [R_Events.END_OF_TRAJECTORY]: R_States.NO_HIT
        },
        [R_States.HIT]: {
            [R_Events.RESTART]: R_States.IDLE
        },
        [R_States.NO_HIT]: {
            [R_Events.RESTART]: R_States.IDLE
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
    const _transitions_from_state = this.transitions[this.state];

    if (undefined === _transitions_from_state) {
        console.error("Unhandled state: " + this.state.description);
        return undefined;
    }
    else {
        // get destination state using the event_
        const _dest = _transitions_from_state[event_];
        if (undefined === _dest) {
            console.warn("Event not allowed: '" + event_.description + "' in current state '" + this.state.description +"'");
        }
        return _dest;
    }
}

/**
 * Performs 3 operations:
 *      1. Gets the destination-state from the current-state given the event_
 *      2. Sets the destination-state as current state
 *      3. Starts the corresponding timer 
 * @param {R_Events} event_ 
 * @return {Bool} true transited properly (current state is now dest state), false otherwise
 */
FSM_Robot.prototype.transit = function (event_) {
    
    console.debug("input event: " + event_.description);
    const _dest = this.get_dest_state(event_);

    if (undefined !== _dest) {

        this.state = _dest;
        console.debug("current state: " + this.state.description);

        // start timers depending on state
        switch (this.state) {
            case R_States.IDLE:
                this.restart_start = undefined;
                break;

            case R_States.LOADING_BULLET:
                this.loading_bullet_start = performance.now();
                break;

            case R_States.BULLET_TRAVELING:
                this.loading_bullet_start = undefined;
                this.bullet_traveling_start = performance.now();
                break;

            case R_States.HIT:
            case R_States.NO_HIT:
                this.bullet_traveling_start = undefined;
                this.restart_start = performance.now();
                break;
        };

        return true;
    }
    else {
        return false;
    }
}

FSM_Robot.prototype.current_is_idle = function () {
    return R_States.IDLE == this.state;
}

FSM_Robot.prototype.current_is_loading_bullet = function () {
    return R_States.LOADING_BULLET == this.state;
}

FSM_Robot.prototype.current_is_bullet_traveling = function () {
    return R_States.BULLET_TRAVELING == this.state;
}

FSM_Robot.prototype.current_is_hit = function () {
    return R_States.HIT == this.state;
}

FSM_Robot.prototype.current_is_no_hit = function () {
    return R_States.NO_HIT == this.state;
}

FSM_Robot.prototype.set_new_state = function (new_state_) {
    this.state = new_state_;
}

FSM_Robot.prototype.state_has_changed = function () {
    return this.prev_state != this.state;
}

const DURATION_LOADING_BULLET_MS = 2000;
const DURATION_BULLET_TRAVELLING_MS = 5000;
const DURATION_RESTART_MS = 1000;

/**
 * Transits betweens stats when timers get expired
 */
FSM_Robot.prototype.update_state = function () {
    this.prev_state = this.state;

    switch (this.state) {
        case R_States.IDLE:
            // doing nothing until "loading bullet event"
            break;
        case R_States.LOADING_BULLET:
            if (this.loading_bullet_expired()) {
                this.transit(R_Events.SHOOT_ENDED);
            }
            break;
        case R_States.BULLET_TRAVELING:
            if (this.bullet_traveling_expired()) {
                this.transit(R_Events.END_OF_TRAJECTORY);
            }
            else {
                // TODO: detect collision
            }
            break;
        case R_States.HIT:
        case R_States.NO_HIT:
            if (this.restart_expired()) {
                this.transit(R_Events.RESTART);
            }
            break;
    }
}

/**
 * Based on DURATION_LOADING_BULLET_MS
 * @return {Bool} true while duration not expired / reached, false otherwise
 */
FSM_Robot.prototype.loading_bullet_expired = function () {
    
    if (this.state != R_States.LOADING_BULLET) {
        return false;
    }
    else {
        if (undefined === this.loading_bullet_start) {
            return false;
        }
        else {
            const _now = performance.now();
            const _elapsed = _now - this.loading_bullet_start; // ms

            if (_elapsed >= DURATION_LOADING_BULLET_MS) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

/**
 * Based on DURATION_BULLET_TRAVELLING_MS
 * @return {Bool} true while duration not expired / reached, false otherwise
 */
FSM_Robot.prototype.bullet_traveling_expired = function () {
    if (this.state != R_States.BULLET_TRAVELING) {
        return false;
    }
    else {
        if (undefined === this.bullet_traveling_start) {
            return false;
        }
        else {
            const _now = performance.now();
            const _elapsed = _now - this.bullet_traveling_start;

            if (_elapsed >= DURATION_BULLET_TRAVELLING_MS) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

/**
 * Based on DURATION_RESTART_MS
 * @return {Bool} true while duration not expired / reached, false otherwise
 */
FSM_Robot.prototype.restart_expired = function () {
    if (this.state != R_States.HIT && this.state != R_States.NO_HIT) {
        return false;
    }
    else {
        if (undefined === this.restart_start) {
            return false;
        }
        else {
            const _now = performance.now();
            const _elapsed = _now - this.restart_start;

            if (_elapsed >= DURATION_RESTART_MS) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

export default {
    FSM_Robot,
    R_Events,
    R_States,
    DURATION_LOADING_BULLET_MS,
    DURATION_BULLET_TRAVELLING_MS,
    DURATION_RESTART_MS
}
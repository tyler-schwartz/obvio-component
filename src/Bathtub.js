import React, { useEffect, useRef, useState } from 'react';

function Bathtub(props)
{
    const MAX_LEVEL     = 5;
    const DEFAULT_DELAY = .1;

    const [level, setLevel]           = useState(0);
    const [direction, setDirection]   = useState(null);
    const [waterLevel, setWaterLevel] = useState(MAX_LEVEL);
    const [delay, setDelay]           = useState(DEFAULT_DELAY);
    const [tick, setTick]             = useState(0);
    const prevDirection               = useRef(null);
    const timeout                     = useRef(null);

    useEffect(() => {
        // If direction is null, we're either initializing or the work is done.
        // In either of these cases we don't want to do anything on the state,
        // so change to null and be done.
        if (direction === null) { return; }

        // If we're going up and the level is already at the desired level; OR...
        // we're going down and the level is at 0 (empty tub), we're done working,
        // so set the direction to null (our "do work" indicator) and split.
        if ((direction === 'up' && level >= Number(waterLevel)) ||
            (direction === 'down' && level === 0)
        ) {
            doReset();
            return;
        }

        // In this case, we're going down and we're looking for a mid-way stop.
        // We need to check the current level - 1, to save having to have another
        // variable for comparison. Because we're "stopping" when the current
        // level - 1 is equal to our desired waterLevel, we still have to change
        // the level one more time so that that the mid-way stop happens on the
        // correct display, not desired waterLevel + 1. Again, change the direction
        // to null and get out of here.
        if (direction === 'down' && (level - 1) === Number(waterLevel)) {
            doChangeLevels();
            doReset();
            return;
        }

        // If we have a prevDirection stored and it happens to NOT be the same as
        // the current direction, this means user has clicked the other button
        // while the first level is rendering. When user wants to switch directions,
        // we need to get rid of the previous timeout so the rendering doesn't
        // get wonky.
        if (prevDirection.current !== null &&
            prevDirection.current !== direction
        ) {
            clearTimeout(timeout.current);
        }

        // At this point, we've figured out we're not stopping work, we're starting
        // it. SO, change the levels to get the instant gratification of something
        // happening on the screen.
        doChangeLevels();

        // Storing the current direction in a reference so we can determine the
        // next time through if user is switching directions.
        prevDirection.current = direction;

        // Use setTimeout() to increment a tick state variable. That is the only
        // work we're doing in the timeout, the useEffect() is watching the tick
        // state to fire again. Since all the stopping logic happens before the
        // timeout is triggered and because we want the instant gratification,
        // the changing of levels can't happen inside the timeout.
        timeout.current = setTimeout(() => {
            setTick(tick => tick + 1);
        }, Number(delay) * 1000);
    }, [direction, tick]);

    /**
     * Check which direction we're going and math the levels into that direction.
     * Common place to do same logic multiple times.
     */
    const doChangeLevels = () => {
        setLevel(direction === 'up' ?
            level + 1 :
            level - 1
        );
    };

    /**
     * A couple scenarios need to reset things, so DRY.
     */
    const doReset = () => {
        setDirection(null);
        clearTimeout(timeout.current);

        prevDirection.current = null;
        timeout.current       = null;
    };

    /**
     * Iterates the number of levels we're currently sitting on and pushes a div
     * into an array. That array gets returend and rendered.
     * @returns array
     */
    const doRenderWater = () => {
        let waterLevels = [];

        for (let i=0; i<level; i++) {
            waterLevels.push(<div
                className={`bathtub-waterlevel level-${i}`}
                key={i}
            />);
        }

        return waterLevels;
    }

    return (
        <div className="bathtub-container">
            <section className="bathtub-controls">
                <button
                    onClick={() => setDirection('up')}
                >
                    Increase Water Level
                </button>

                <div>
                    <article>
                        <label>Waterlevel</label>
                        <select
                            onChange={event => setWaterLevel(event.target.value)}
                            value={waterLevel}
                        >
                            <option value="5">Half-way</option>
                            <option value="8">Over your knees</option>
                            <option value="10">Full up!</option>
                        </select>
                    </article>
                    <article>
                        <label>Delay</label>
                        <select
                            onChange={event => setDelay(event.target.value)}
                            value={delay}
                        >
                            <option value=".1">1/10 second</option>
                            <option value=".5">1/2 second</option>
                            <option value="1">1 second</option>
                            <option value="2">2 seconds</option>
                            <option value="5">5 seconds</option>
                        </select>
                    </article>
                </div>

                <button
                    onClick={() => setDirection('down')}
                >
                    Decrease Water Level
                </button>
            </section>

            <div className="bathtub-tub">
                {doRenderWater()}
            </div>

            <div className="bathtub-info">
                <span>Direction: {direction || '--'}</span>
                <span>Level: {level}</span>
            </div>

            <p>
                <a
                    href="https://github.com/tyler-schwartz/obvio-component/blob/2.1/src/Bathtub.js"
                    rel="noreferrer"
                    target="_blank"
                >
                    Github: obvio-component
                </a>
            </p>
        </div>
    )
}

export default Bathtub;

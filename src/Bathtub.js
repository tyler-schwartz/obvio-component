import React, { useEffect, useState, useRef } from 'react';

function Bathtub(props)
{
    const MAX_LEVEL     = 5;
    const DEFAULT_DELAY = 2;
    const interval      = useRef(null);

    const [levels, setLevels]         = useState([]);
    const [direction, setDirection]   = useState(null);
    const [waterLevel, setWaterLevel] = useState(MAX_LEVEL);
    const [delay, setDelay]           = useState(DEFAULT_DELAY);

    // Gonna do some work anytime the direction state value changes.
    useEffect(() => {
        // If it's null, we're either initializing or the work is done. In either
        // of these cases we don't want to do anything on the state change to null.
        if (direction === null) { return; }

        // Before any work is done, if we're being told to up and we're already
        // at the desired level, reset the direction and be done.
        if (direction === 'up' && levels.length === waterLevel) {
            setDirection(null);
            return;
        }

        // Change the level and set it to the state so that user sees something
        // happening. If the delay is longer, it takes some time before any visual
        // indication of work is happening. Creating a new array, so that we can
        // trigger a render of the component after the state commit.
        doChangeLevels();
        setLevels(Object.assign([], levels));

        // Set the ref to the setInterval() id so we have something to clear when
        // the work is done.
        interval.current = setInterval(() => {
            // Depending on the direction, push or pop an element from the array
            // of water levels. Array? Easier to .map() and allows for some future-
            // proofing if it's a collection of items, opposed to just a level.
            doChangeLevels();

            // Three cases where we want to stop working:
            // 1. We're moving the level up and the length of the water level
            //    array is at the desired level;
            // 2. We're moving down and the length of the array is at the desired
            //    level - this handles the case of starting from "full up" and
            //    ending at "half-way";
            // 3. We're moving down and the length of the array is 0, we've
            //    removed everything and the tub is empty.
            if ((direction === 'up' && levels.length >= Number(waterLevel)) ||
                (direction === 'down' && levels.length === Number(waterLevel)) ||
                (direction === 'down' && levels.length === 0)
            ) {
                // Don't want to keep iterating...
                clearInterval(interval.current);
                // Creating a new array, so that we can trigger a render of the
                // component after the state commit.
                setLevels(Object.assign([], levels));
                // Need to make sure we change the direction to null, so that we
                // can capture the "do work" signal again after.
                setDirection(null);
                // We're done, so get out of here.
                return;
            }

            // At this point, levels has "local" changes but hasn't been saved to
            // state yet. Creating a new array, so that we can trigger a render
            // of the component after the state commit.
            setLevels(Object.assign([], levels));
        }, Number(delay) * 1000);
    }, [direction]);

    const doChangeLevels = () => {
        direction === 'up' ?
            levels.push({}) :
            levels.pop();
    };

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
                {levels.map((item, key) => {
                    return <div
                        className={`bathtub-waterlevel level-${key}`}
                        key={key}
                    />
                })}
            </div>

            <div className="bathtub-info">
                <span>Direction: {direction || '--'}</span>
                <span>Level: {levels.length}</span>
            </div>

            <p>
                <a
                    href="https://github.com/tyler-schwartz/obvio-component/tree/master/src"
                    target="_blank"
                >
                    Github: obvio-component
                </a>
            </p>
        </div>
    )
}

export default Bathtub;

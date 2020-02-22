import React from "react";
import PlayerButton from "./PlayerButton";
import RangeButton from "./RangeButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faPlay, faPause, faRandom, faSyncAlt, 
    faChevronLeft, faChevronRight, faVolumeDown
} from "@fortawesome/free-solid-svg-icons";

export default class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            paused: true,
            duration: "0:00",
            currentTime: "0:00",
            currentTimeInSec: 0
        }

        this.setPaused = this.setPaused.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.setCurrentTime = this.setCurrentTime.bind(this);
        this.onEnded = this.onEnded.bind(this);
    }

    setPaused() {
        this.setState(
            preState => {
                if(!preState.paused) {
                    this.audioInPlay.pause();
                } else {
                    this.audioInPlay.play();
                }

                return (
                    {
                        paused: !preState.paused
                    }
                );
            }
        );
    }

    setVolume(newVolume) {
        if(newVolume < 0) {
            newVolume = 0;
        }

        if(newVolume > 1) {
            newVolume = 1;
        }

        this.audioInPlay.volume = newVolume;
    }

    setCurrentTime(newCurrentTime) {
        if(isFinite(newCurrentTime)) {
            if(newCurrentTime < 0) {
                this.audioInPlay.currentTime = 0;
            }

            if(newCurrentTime > this.state.duration) {
                this.audioInPlay.currentTime = this.state.duration;
            }

            this.audioInPlay.currentTime = newCurrentTime;
        }
    }

    componentDidMount() {
        this.audioInPlay = document.getElementById("audio-in-play");
    }

    formatSeconds(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        let result = h > 0 ? (h + ":") : "";
        result += m + ":" + (s.toString().split('.')[0].length == 1 ? ("0" + s.toString().split('.')[0]) : s.toString().split('.')[0]);

        return result;
    }

    onLoadedMetadata(event) {
        this.durationInSec = event.target.duration;

        this.setState({
            duration: this.formatSeconds(event.target.duration)
        });
    }

    onTimeUpdate(event) {
        this.setState({
            currentTimeInSec: event.target.currentTime,
            currentTime: this.formatSeconds(event.target.currentTime)
        });
    }

    onEnded(event) {
        this.setState({
            paused: true,
            currentTime: "0:00",
            currentTimeInSec: 0
        });
    }

    render() {
        return (
            <div id={this.props.id}>
                <audio id="audio-in-play" onTimeUpdate={this.onTimeUpdate} onLoadedMetadata={this.onLoadedMetadata}
                onEnded={this.onEnded}>
                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                </audio>

                <div id="buttons-container">
                    <div>
                        <PlayerButton buttonID="prev-button">
                            <FontAwesomeIcon key="prev-button" icon={faChevronLeft} />
                        </PlayerButton>
                    </div>

                    <div>
                        <div>
                            {
                                this.state.paused ? (
                                        <PlayerButton buttonID="play-button" setPaused={this.setPaused}>
                                            <FontAwesomeIcon key="play-button-play" icon={faPlay} />
                                        </PlayerButton>
                                    ) : (
                                        <PlayerButton buttonID="play-button" setPaused={this.setPaused}>
                                            <FontAwesomeIcon key="play-button-pause" icon={faPause} />
                                        </PlayerButton>
                                    )
                            }
                        </div>

                        <div>
                            <PlayerButton buttonID="shuffle-button">
                                <FontAwesomeIcon key="shuffle-button" icon={faRandom} />
                            </PlayerButton>

                            <PlayerButton buttonID="loop-button">
                                <FontAwesomeIcon key="loop-button" icon={faSyncAlt} />
                            </PlayerButton>
                        </div>
                    </div>

                    <div>
                        <PlayerButton buttonID="next-button">
                            <FontAwesomeIcon key="next-button" icon={faChevronRight} />
                        </PlayerButton>
                    </div>
                </div>

                <div id="volume-container">
                    <RangeButton id="volume" playerID={this.props.id} orientation="vertical"
                    setVolume={this.setVolume}>
                        <FontAwesomeIcon key="volume" icon={faVolumeDown} />
                    </RangeButton>
                </div>

                <div id="seek-container">
                    <div>SoundHelix Song 1</div>

                    <div>
                        <span>{this.state.currentTime}</span>
                        <span>{this.state.duration}</span>
                    </div>
                    
                    <RangeButton id="seek" orientation="horizontal" setCurrentTime={this.setCurrentTime} 
                    durationInSec={this.durationInSec} currentTimeInSec={this.state.currentTimeInSec} />
                </div>
            </div>
        );
    }
}

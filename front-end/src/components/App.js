import React from "react";
import Player from "./Player";
import AlbumCover from "./AlbumCover";
import MainGrid from "./MainGrid";
import CreatePlayDialog from "./CreatePlayListDialog";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentAudio: null,
            currentCoverURL: null,
            playNow: false,
            shuffleOn: false,
            loopOn: false,
            dialogDisplay: "none"
        };

        this.changeAudio = this.changeAudio.bind(this);
        this.changeCurrentPlayList = this.changeCurrentPlayList.bind(this);
        this.nextOrPrevAudio = this.nextOrPrevAudio.bind(this);
        this.onOffShuffle = this.onOffShuffle.bind(this);
        this.onOffLoop = this.onOffLoop.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    changeAudio(audio, playNow) {
        this.setState({
            currentAudio: audio,
            currentCoverURL: audio.coverURL,
            playNow: playNow
        });

        if(!this.state.shuffleOn) {
            this.currentPlayList.audios.forEach(
                (item, index) => {
                    if(item._id == audio._id) {
                        this.currentAudioIndex = index;
    
                        return;
                    }            
                }
            );
        }
    }

    changeCurrentPlayList(playList) {
        this.currentPlayList = playList;
        this.currentAudioIndex = -1;

        this.shuffledAudios = this.currentPlayList.audios.slice(0);
        this.shuffledAudios.sort(
            (a, b) => {
                return Math.floor(Math.random() * 100) % 3 == 0 ? 1 : -1;
            }
        );
    }

    nextOrPrevAudio(playNext = true, userPassesAudio = false) {
        if(playNext) {
            this.currentAudioIndex++;
        } else {
            this.currentAudioIndex--;

            if(this.currentAudioIndex < 0) {
                this.currentAudioIndex = this.currentPlayList.audios.length - 1;
            }
        }

        if(!this.state.loopOn && !userPassesAudio && this.currentAudioIndex >= this.currentPlayList.audios.length) {
            this.currentAudioIndex = -1;

            return;
        }

        const nextAudioIndex = (this.currentAudioIndex % this.currentPlayList.audios.length);
        const nextAudio = this.state.shuffleOn ? 
            this.shuffledAudios[nextAudioIndex] : 
            this.currentPlayList.audios[nextAudioIndex];

        this.setState({
            currentAudio: nextAudio,
            currentCoverURL: nextAudio.coverURL,
            playNow: true
        });

        this.currentAudioIndex = nextAudioIndex;
    }

    onOffShuffle() {
        this.setState(
            (prevState) => {
                if(!prevState.shuffleOn) {
                    this.currentAudioIndex = -1;
                } else {
                    this.currentPlayList.audios.forEach(
                        (item, index) => {
                            if(item._id == this.state.currentAudio._id) {
                                this.currentAudioIndex = index;
            
                                return;
                            }            
                        }
                    );
                }

                return (
                    {
                        shuffleOn: !prevState.shuffleOn
                    }
                );
            }
        );
    }

    onOffLoop() {
        this.setState(
            (prevState) => {
                return (
                    {
                        loopOn: !prevState.loopOn
                    }
                );
            }
        );
    }

    showDialog() {
        this.setState({
            dialogDisplay: "flex"
        });
    }

    closeDialog() {
        this.setState({
            dialogDisplay: "none"
        });
    }

    render() {
        return (
            <>
                <CreatePlayDialog id="create-play-list-dialog" display={this.state.dialogDisplay}
                closeDialog={this.closeDialog} />

                <MainGrid id="main-grid" changeAudio={this.changeAudio} 
                currentAudioID={this.state.currentAudio && this.state.currentAudio._id}
                changeCurrentPlayList={this.changeCurrentPlayList}
                showDialog={this.showDialog} />

                <AlbumCover id="album-cover" coverURL={this.state.currentCoverURL} />

                <Player id="player" audio={this.state.currentAudio} playNow={this.state.playNow}
                nextOrPrevAudio={this.nextOrPrevAudio} shuffleOn={this.state.shuffleOn}
                loopOn={this.state.loopOn} onOffShuffle={this.onOffShuffle} onOffLoop={this.onOffLoop} />
            </>
        );
    }
}

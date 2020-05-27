import React from 'react';
import Timer from 'react-compound-timer';
import { GameLayout } from 'components/App/Game/GameLayout';
import { IGameArgs } from 'components/App/Game/GameBoardWrapper';
import { isOnlineGame, isAIGame, isLocalGame } from '../common/gameMode';
import { IPlayerInRoom } from 'components/App/Lobby/LobbyService';
import { Ctx } from 'boardgame.io';
import { Modal, Button, Typography, Box, List, ListItem, ListItemText } from '@material-ui/core';
import { TIME_OUT, TIME_BUFF } from './constants';
import { IG, ISolvedWord } from './game';
import { Soup } from './soup'
import soupCSS from './soup.css'

interface IBoardProps {
  G: IG;
  ctx: Ctx;
  moves: any;
  playerID: string;
  gameArgs?: IGameArgs;
}

interface IBoardState {
  showWords: boolean;
}

export const localPlayerNames = { '0': 'red', '1': 'blue' };

export class Board extends React.Component<IBoardProps, IBoardState> {

  constructor(props) {
    super(props);
    // initialize state
    this.state = {
      showWords: false,
    };
  }

  _wordFound = (solvedWord: ISolvedWord) => {
    this.props.moves.wordFound(solvedWord);
  }
  
  _playerInRoom(): IPlayerInRoom {
    return this.props.gameArgs.players[this.props.ctx.currentPlayer];
  }

  _getStatus() {
    if (!this.props.gameArgs) {
      return;
    }

    if (isOnlineGame(this.props.gameArgs)) {
      return `Online Game`;
    }
    return `Turn Player ${this.props.ctx.currentPlayer}`;
  }

  _checkTimeOut = (secondsLeft: number) => {
    if (isOnlineGame(this.props.gameArgs) && this.props.playerID !== this.props.ctx.currentPlayer) { return; }
    if ((secondsLeft === 0) || ((Date.now() - this.props.G.timeRef) > ((TIME_OUT + TIME_BUFF)*1000)) ) {
      this.props.moves.changeTurn();
    }
  }

  _getTimeRemaining() {
    // check time every second
    const secondlyCallback = []; 
    for (let i=0; i<TIME_OUT; i++){
      secondlyCallback.push({
        time: i * 1000,
        callback: () => {this._checkTimeOut(i)}
      });
    }
    // render timer 
    return(
      <Timer
        key={'timer-' + this.props.G.timeRef}
        initialTime={(TIME_OUT + TIME_BUFF)*1000 - (Date.now() - this.props.G.timeRef)}
        direction="backward"
        checkpoints={secondlyCallback}
      >
        {
          isOnlineGame(this.props.gameArgs) && this.props.playerID !== this.props.ctx.currentPlayer?
          <Timer.Seconds formatValue={value => this._playerInRoom().name + ` has ${value>TIME_OUT?TIME_OUT:(value<0?0:value)} seconds.`} /> :
          <Timer.Seconds formatValue={value => `You have ${value>TIME_OUT?TIME_OUT:value} seconds.`} />
        }
      </Timer>

    );
  }

  _getWordModal() {
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          BackdropProps={{ invisible: true }}
          open={this.state.showWords}
          onClose={() => this.setState({ showWords: false })}
          style={{
            marginTop: '20px',
            width: '250px',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'white',
          }}
        >
          <div>  
            <Typography style={{ padding: '16px' }} variant="h5" component="h3">
              Words
            </Typography>
            <List>
              {
                this.props.G.solution.map(s => (
                    <ListItem
                      key={'list-item-'+s.word}
                      // add a strike style is word is found
                      style={{ textDecoration : s.solvedBy ? 'line-through' : 'none' }} 
                    >
                      <ListItemText primary={s.word} />                    
                    </ListItem>
                  ))
                }
            </List>
          </div>
        </Modal>
      </div>
    );
  }

  _showModalButton() {
    return (
      <Box 
        display="flex" 
        width={500} height={40} 
        bgcolor="black"
        alignItems="center"
        justifyContent="center"
      >
        <Button 
          variant="contained"
          onClick={() => {this.setState({showWords:true})}}
        >
          Words
        </Button>
      </Box>
    );
  }

  _getGameOver() {
    if (isOnlineGame(this.props.gameArgs) || isAIGame(this.props.gameArgs)) {
      if (this.props.ctx.gameover.winner === this.props.playerID) {
        return 'you won';
      } else {
        return 'you lost';
      }
    } else {
      if (this.props.ctx.gameover.winner) {
        return `${localPlayerNames[this.props.ctx.gameover.winner]} won`;
      }
    }
  }  

  _getBoard(boardSize = 100) {

    return (
      <Soup 
        boardSize={boardSize} 
        puzzel={this.props.G.puzzel}
        solution={this.props.G.solution}
        currentPlayer={this.props.ctx.currentPlayer}
        wordFoundCallback={this._wordFound}
      />
    );
  }

  render() {
    if (this.props.ctx.gameover) {
      return (
        <GameLayout
          gameOver={this._getGameOver()}
          extraCardContent={this._getBoard(50)}
          gameArgs={this.props.gameArgs}
        />
      );
    }
    return (
      <GameLayout gameArgs={this.props.gameArgs}>
        <Typography 
          className={soupCSS.noselect} variant="h5" 
          style={{ color: 'white', textAlign: 'center' }}
        >
          {this._getStatus()}
        </Typography>
        <Typography 
            className={soupCSS.noselect} variant='h6' 
            style={{ color: 'white', textAlign: 'center' }}
        >
        {this._getTimeRemaining()}
        </Typography>
        {this._getBoard()}
        {this._showModalButton()}        
        {this._getWordModal()}
      </GameLayout>
    );
  }
}

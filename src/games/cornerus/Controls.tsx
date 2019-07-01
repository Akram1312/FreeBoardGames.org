import React from 'react';

import { IGameCtx } from '@freeboardgame.org/boardgame.io/core';

import { IG, rotatePiece, flipPieceY, flipPieceX, getPlayer } from './game';
import { IPiece } from './board';
import { pieces } from './pieces';

import Done from '@material-ui/icons/Done';
import RotateLeft from '@material-ui/icons/RotateLeft';
import RotateRight from '@material-ui/icons/RotateRight';
import Flip from '@material-ui/icons/Flip';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import css from './Controls.css';

interface IControlsProps {
  placePiece: () => void;
  openDialog: () => void;
  modifyPiece: (piece: IPiece) => void;
  piece: IPiece;
  G: IG;
  ctx: IGameCtx;
}

export default class Controls extends React.Component<IControlsProps, {}> {
  _flipY = this.flipY.bind(this);
  _flipX = this.flipX.bind(this);

  rotate(n: number) {
    let data = rotatePiece(this.props.piece.data);
    for (let i = 0; i < n - 1; i++) {
      data = rotatePiece(data);
    }

    this.props.modifyPiece({
      ...this.props.piece,
      transform: {
        ...this.props.piece.transform,
        rotation: (this.props.piece.transform.rotation + n) % 4,
      },
      data,
    });
  }

  flipY() {
    this.props.modifyPiece({
      ...this.props.piece,
      transform: {
        ...this.props.piece.transform,
        flipY: !this.props.piece.transform.flipY,
        rotation:
          this.props.piece.transform.rotation % 2 === 0
            ? this.props.piece.transform.rotation
            : (this.props.piece.transform.rotation + 2) % 4,
      },
      data: flipPieceY(this.props.piece.data),
    });
  }

  flipX() {
    this.props.modifyPiece({
      ...this.props.piece,
      transform: {
        ...this.props.piece.transform,
        flipX: !this.props.piece.transform.flipX,
        rotation:
          this.props.piece.transform.rotation % 2 === 0
            ? this.props.piece.transform.rotation
            : (this.props.piece.transform.rotation + 2) % 4,
      },
      data: flipPieceX(this.props.piece.data),
    });
  }

  select(offset: number) {
    const playerID = getPlayer(this.props.ctx, this.props.ctx.currentPlayer);
    const index = (this.props.piece.index + offset) % this.props.G.players[playerID as any].pieces.length;
    this.props.modifyPiece({
      ...this.props.piece,
      index,
      data: pieces[this.props.G.players[playerID as any].pieces[index]],
      transform: { ...this.props.piece.transform, flipX: false, flipY: false, rotation: 0 },
    });
  }

  render() {
    return (
      <div className={css.Controls}>
        <IconButton onClick={() => this.rotate(3)}>
          <RotateLeft />
        </IconButton>
        <IconButton onClick={() => this.rotate(1)}>
          <RotateRight />
        </IconButton>
        <IconButton onClick={this._flipY} style={{ transform: 'rotate(90deg)' }}>
          <Flip />
        </IconButton>
        <IconButton onClick={this._flipX}>
          <Flip />
        </IconButton>
        <IconButton
          onClick={() =>
            this.select(
              this.props.G.players[getPlayer(this.props.ctx, this.props.ctx.currentPlayer) as any].pieces.length - 1,
            )
          }
        >
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={() => this.select(1)}>
          <ChevronRight />
        </IconButton>
        <IconButton onClick={this.props.placePiece}>
          <Done />
        </IconButton>
        <IconButton onClick={this.props.openDialog}>
          <Close />
        </IconButton>
      </div>
    );
  }
}

import Enzyme from 'enzyme';
import { getPageMetadata } from './metadata';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const TITLE_PREFIX = 'FreeBoardGame.org - ';

describe('Metadata', () => {
  it('should show metadata correctly', () => {
    let metadata;
    metadata = getPageMetadata('/');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Play Free Board Games Online');
    expect(metadata.description).to.contain('in your browser for free. Compete against');

    metadata = getPageMetadata('/g/chess');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Play Free Chess Online');
    expect(metadata.description).to.contain('game of chess');

    metadata = getPageMetadata('/g/chess/local');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Locally');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/g/chess/online');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Online Friend');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/g/chess/ai');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('the Computer');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/g/seabattle');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Free Seabattle');
    expect(metadata.description).to.contain('sink ships');

    metadata = getPageMetadata('/g/seabattle/online');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Online Friend');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/g/seabattle/ai');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('the Computer');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/g/tictactoe');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Play Free Tic-Tac-Toe Online');
    expect(metadata.description).to.contain('Play Tic-Tac-Toe in your browser');

    metadata = getPageMetadata('/g/tictactoe/local');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Locally');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/g/tictactoe/online');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('Online Friend');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/g/tictactoe/ai');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('the Computer');
    expect(metadata.noindex).to.equal(true);

    metadata = getPageMetadata('/about');
    expect(metadata.title).to.contain(TITLE_PREFIX);
    expect(metadata.title).to.contain('About Us');
    expect(metadata.description).to.contain('a free and');
  });
});
